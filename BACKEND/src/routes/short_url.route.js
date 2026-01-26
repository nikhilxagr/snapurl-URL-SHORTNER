import express from "express";
import {
  createShortUrl,
  getOriginalUrl,
  getAllUrls,
} from "../controllers/short_url.controller.js";

const router = express.Router();

router.post("/create", createShortUrl);
router.get("/urls", getAllUrls);
router.get("/:shortCode", getOriginalUrl);

export default router;
