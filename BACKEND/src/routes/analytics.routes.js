import express from "express";
import ShortUrl from "../models/short_url.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get dashboard statistics
router.get("/dashboard", protect, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Total URLs
    const totalUrls = await ShortUrl.countDocuments({
      userId,
      isDeleted: false,
    });

    // Total clicks
    const clicksAgg = await ShortUrl.aggregate([
      { $match: { userId, isDeleted: false } },
      { $group: { _id: null, totalClicks: { $sum: "$clicks" } } },
    ]);

    const totalClicks = clicksAgg[0]?.totalClicks || 0;

    // Active URLs
    const activeUrls = await ShortUrl.countDocuments({
      userId,
      isDeleted: false,
      isActive: true,
    });

    // Top performing URLs
    const topUrls = await ShortUrl.find({
      userId,
      isDeleted: false,
    })
      .sort({ clicks: -1 })
      .limit(5)
      .select("originalUrl shortId customAlias clicks title createdAt");

    // Recent URLs
    const recentUrls = await ShortUrl.find({
      userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("originalUrl shortId customAlias clicks title createdAt");

    // Clicks over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clicksOverTime = await ShortUrl.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
          "clicksData.timestamp": { $gte: thirtyDaysAgo },
        },
      },
      { $unwind: "$clicksData" },
      {
        $match: {
          "clicksData.timestamp": { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$clicksData.timestamp",
            },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalUrls,
        totalClicks,
        activeUrls,
        topUrls,
        recentUrls,
        clicksOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
