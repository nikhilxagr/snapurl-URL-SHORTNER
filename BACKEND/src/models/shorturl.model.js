import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
  full_Url: {
    type: String,   
    required: true,
  },
  short_Url: {
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

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);

export default shortUrl;