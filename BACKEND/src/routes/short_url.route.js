import express from "express";
import {
  createShortUrl,
  getUserUrls,
  getUrlDetails,
  updateUrl,
  deleteUrl,
  getUrlStats,
} from "../controller/short_url.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", createShortUrl);
router.get("/my-urls", protect, getUserUrls);
router.get("/:id", protect, getUrlDetails);
router.patch("/:id", protect, updateUrl);
router.delete("/:id", protect, deleteUrl);
router.get("/:id/stats", protect, getUrlStats);

export default router;
