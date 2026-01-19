import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/mongodb.config.js";
import urlSchema from "./src/models/shorturl.model.js";

dotenv.config("./.env");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB connection
connectDB();

app.post("/api/create", async (req, res) => {
  try {
    const { url } = req.body;

    // Validate if url is provided
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortUrl = nanoid(7);
    const newUrl = new urlSchema({
      full_Url: url,
      short_Url: shortUrl,
    });
    await newUrl.save();
    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error("Error creating short URL:", error.message);
    res.status(500).json({ error: "Failed to create short URL" });
  }
});



app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

export default app;
