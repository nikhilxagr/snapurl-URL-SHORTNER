import { nanoid } from "nanoid";
import ShortUrl from "../models/short_url.model.js";
import QRCode from "qrcode";
import validator from "validator";
import UAParser from "ua-parser-js";
import bcrypt from "bcryptjs";

// Create shortened URL
export const createShortUrl = async (req, res, next) => {
  try {
    const {
      originalUrl,
      customAlias,
      title,
      description,
      expiresIn,
      password,
      maxClicks,
      tags,
    } = req.body;

    // Validation
    if (!originalUrl) {
      return res.status(400).json({
        status: "error",
        message: "Original URL is required",
      });
    }

    if (!validator.isURL(originalUrl, { require_protocol: true })) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid URL format. Must include protocol (http:// or https://)",
      });
    }

    // Check if custom alias is already taken
    if (customAlias) {
      const existing = await ShortUrl.findOne({
        $or: [{ customAlias }, { shortId: customAlias }],
        isDeleted: false,
      });

      if (existing) {
        return res.status(409).json({
          status: "error",
          message: "Custom alias is already taken",
        });
      }
    }

    // Calculate expiration date
    let expiresAt = null;
    if (expiresIn && expiresIn > 0) {
      expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create short URL document
    const shortUrl = new ShortUrl({
      originalUrl,
      customAlias: customAlias || undefined,
      title: title || undefined,
      description: description || undefined,
      userId: req.user?._id,
      expiresAt,
      password: hashedPassword,
      maxClicks: maxClicks || undefined,
      tags: tags || [],
    });

    await shortUrl.save();

    // Generate QR code
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const shortLink = `${baseUrl}/${shortUrl.customAlias || shortUrl.shortId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shortLink);
    shortUrl.qrCode = qrCodeDataUrl;
    await shortUrl.save();

    res.status(201).json({
      status: "success",
      data: {
        originalUrl: shortUrl.originalUrl,
        shortUrl: shortLink,
        shortId: shortUrl.customAlias || shortUrl.shortId,
        qrCode: qrCodeDataUrl,
        title: shortUrl.title,
        description: shortUrl.description,
        expiresAt: shortUrl.expiresAt,
        createdAt: shortUrl.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Redirect from short URL
export const redirectFromShortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.query;

    const shortUrl = await ShortUrl.findOne({
      $or: [{ shortId: id }, { customAlias: id }],
      isDeleted: false,
    }).select("+password");

    if (!shortUrl) {
      return res.status(404).json({
        status: "error",
        message: "Short URL not found",
      });
    }

    // Check if URL can be accessed
    if (!shortUrl.canAccess()) {
      let message = "This link is no longer available";
      if (shortUrl.isExpired()) message = "This link has expired";
      if (shortUrl.hasReachedMaxClicks())
        message = "This link has reached its maximum number of clicks";
      if (!shortUrl.isActive) message = "This link has been deactivated";

      return res.status(410).json({
        status: "error",
        message,
      });
    }

    // Check password protection
    if (shortUrl.password) {
      if (!password) {
        return res.status(401).json({
          status: "error",
          message: "This link is password protected",
          requiresPassword: true,
        });
      }

      const isValidPassword = await bcrypt.compare(password, shortUrl.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: "error",
          message: "Incorrect password",
          requiresPassword: true,
        });
      }
    }

    // Track analytics
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const clickData = {
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer || req.headers.referrer || "Direct",
      device: result.device.type || "Desktop",
      browser: result.browser.name || "Unknown",
      os: result.os.name || "Unknown",
    };

    shortUrl.clicks += 1;
    shortUrl.clicksData.push(clickData);
    await shortUrl.save();

    res.redirect(shortUrl.originalUrl);
  } catch (error) {
    next(error);
  }
};

// Get all URLs for a user
export const getUserUrls = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      search = "",
      tag = "",
    } = req.query;

    const query = {
      userId: req.user._id,
      isDeleted: false,
    };

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { customAlias: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const urls = await ShortUrl.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-clicksData -password");

    const total = await ShortUrl.countDocuments(query);

    res.status(200).json({
      status: "success",
      data: {
        urls,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single URL details
export const getUrlDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shortUrl = await ShortUrl.findOne({
      $or: [{ shortId: id }, { customAlias: id }, { _id: id }],
      userId: req.user._id,
      isDeleted: false,
    });

    if (!shortUrl) {
      return res.status(404).json({
        status: "error",
        message: "URL not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: shortUrl,
    });
  } catch (error) {
    next(error);
  }
};

// Update URL
export const updateUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, isActive, tags } = req.body;

    const shortUrl = await ShortUrl.findOne({
      _id: id,
      userId: req.user._id,
      isDeleted: false,
    });

    if (!shortUrl) {
      return res.status(404).json({
        status: "error",
        message: "URL not found",
      });
    }

    if (title !== undefined) shortUrl.title = title;
    if (description !== undefined) shortUrl.description = description;
    if (isActive !== undefined) shortUrl.isActive = isActive;
    if (tags !== undefined) shortUrl.tags = tags;

    await shortUrl.save();

    res.status(200).json({
      status: "success",
      data: shortUrl,
    });
  } catch (error) {
    next(error);
  }
};

// Delete URL (soft delete)
export const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shortUrl = await ShortUrl.findOne({
      _id: id,
      userId: req.user._id,
      isDeleted: false,
    });

    if (!shortUrl) {
      return res.status(404).json({
        status: "error",
        message: "URL not found",
      });
    }

    shortUrl.isDeleted = true;
    await shortUrl.save();

    res.status(200).json({
      status: "success",
      message: "URL deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get URL statistics
export const getUrlStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shortUrl = await ShortUrl.findOne({
      $or: [{ shortId: id }, { customAlias: id }, { _id: id }],
      userId: req.user._id,
      isDeleted: false,
    });

    if (!shortUrl) {
      return res.status(404).json({
        status: "error",
        message: "URL not found",
      });
    }

    // Aggregate statistics
    const deviceStats = {};
    const browserStats = {};
    const osStats = {};
    const refererStats = {};
    const dailyClicks = {};

    shortUrl.clicksData.forEach((click) => {
      // Device stats
      deviceStats[click.device] = (deviceStats[click.device] || 0) + 1;

      // Browser stats
      browserStats[click.browser] = (browserStats[click.browser] || 0) + 1;

      // OS stats
      osStats[click.os] = (osStats[click.os] || 0) + 1;

      // Referer stats
      refererStats[click.referer] = (refererStats[click.referer] || 0) + 1;

      // Daily clicks
      const date = click.timestamp.toISOString().split("T")[0];
      dailyClicks[date] = (dailyClicks[date] || 0) + 1;
    });

    res.status(200).json({
      status: "success",
      data: {
        totalClicks: shortUrl.clicks,
        deviceStats,
        browserStats,
        osStats,
        refererStats,
        dailyClicks,
        recentClicks: shortUrl.clicksData.slice(-20).reverse(),
      },
    });
  } catch (error) {
    next(error);
  }
};
