import { nanoid } from "nanoid";
import ShortUrl from "../models/short_url.model.js"; // ✅ Make sure this import exists

export const createShortUrl = async (req, res, next) => {
  try {
    console.log("📥 Create request body:", req.body);
    console.log("🔍 Model available:", !!ShortUrl);

    const { url, customAlias } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const shortCode = customAlias || nanoid(8);

    console.log("💾 Attempting to save to database...");

    const shortUrl = await ShortUrl.create({
      originalUrl: url,
      shortCode: shortCode,
      userId: req.user?._id,
      clicks: 0,
    });

    console.log("✅ Saved to database:", shortUrl.toObject());

    const shortLink = `${process.env.APP_URL}${shortCode}`;

    res.status(201).json({
      success: true,
      data: {
        originalUrl: url,
        shortUrl: shortLink,
        shortCode: shortCode,
        _id: shortUrl._id,
      },
    });
  } catch (error) {
    console.error("❌ Error creating short URL:", error);
    next(error);
  }
};

export const redirectFromShortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("🔍 Looking for shortCode:", id);

    const urlDoc = await ShortUrl.findOne({ shortCode: id });
    console.log("📄 Found document:", urlDoc);

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    urlDoc.clicks = (urlDoc.clicks || 0) + 1;
    await urlDoc.save();

    console.log("↗️ Redirecting to:", urlDoc.originalUrl);
    res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error("❌ Error redirecting:", error);
    next(error);
  }
};

export const getAllUrls = async (req, res, next) => {
  try {
    const urls = await ShortUrl.find({ userId: req.user?._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error("❌ Error fetching URLs:", error);
    next(error);
  }
};
