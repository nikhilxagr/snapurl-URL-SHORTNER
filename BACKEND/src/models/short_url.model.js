import mongoose from "mongoose";
import { nanoid } from "nanoid";

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  referer: String,
  country: String,
  city: String,
  device: String,
  browser: String,
  os: String,
});

const shortUrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },
    shortId: {
      type: String,
      unique: true,
      default: () => nanoid(8),
      index: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9-_]+$/,
        "Custom alias can only contain letters, numbers, hyphens, and underscores",
      ],
    },
    title: {
      type: String,
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    qrCode: {
      type: String, // Base64 encoded QR code
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clicksData: [clickSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    password: {
      type: String,
      select: false, // Don't include in queries by default
    },
    maxClicks: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better performance
shortUrlSchema.index({ userId: 1, createdAt: -1 });
shortUrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
shortUrlSchema.index({ isDeleted: 1, isActive: 1 });

// Virtual for short URL
shortUrlSchema.virtual("shortUrl").get(function () {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl}/${this.customAlias || this.shortId}`;
});

// Methods
shortUrlSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

shortUrlSchema.methods.hasReachedMaxClicks = function () {
  if (!this.maxClicks) return false;
  return this.clicks >= this.maxClicks;
};

shortUrlSchema.methods.canAccess = function () {
  return (
    this.isActive &&
    !this.isDeleted &&
    !this.isExpired() &&
    !this.hasReachedMaxClicks()
  );
};

// Pre-save middleware
shortUrlSchema.pre("save", function (next) {
  if (this.customAlias) {
    this.shortId = this.customAlias;
  }
  next();
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
