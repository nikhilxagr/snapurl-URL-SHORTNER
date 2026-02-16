import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
    },
    shortCode: {
      type: String,
      required: [true, "Short code is required"],
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "urls", // ✅ Explicitly set collection name to match Atlas
  },
);

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
