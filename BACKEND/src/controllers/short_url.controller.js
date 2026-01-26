import ShortUrl from "../models/short_url.model.js";
import { nanoid } from "nanoid";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    // Check if URL already exists
    const existingUrl = await ShortUrl.findOne({ originalUrl });
    if (existingUrl) {
      return res.status(200).json(existingUrl);
    }

    // Generate short code
    const shortCode = nanoid(8);

    const newUrl = await ShortUrl.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json(newUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlData = await ShortUrl.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Increment click count
    urlData.clicks += 1;
    await urlData.save();

    res.redirect(urlData.originalUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await ShortUrl.find().sort({ createdAt: -1 });
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
