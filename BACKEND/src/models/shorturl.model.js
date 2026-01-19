import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,   
    required: true,
  },
  shortId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
    clicks: {
    type: Number,
    require: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
