import "dotenv/config";
import express from "express";
const app = express();
import { nanoid } from "nanoid";
import connectDB from "./src/config/mongodb.config.js";
import shortUrlSchema from "./src/models/shorturl.model.js";

await connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/create", async (req, res) => {
  try {
    const { fullUrl } = req.body;
    const shortId = nanoid(7);
    const newShortUrl = new shortUrlSchema({ fullUrl, shortId });
    await newShortUrl.save();
    res.json({ shortId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// GET  - Redirection
// POST - Create short URL
export default app;