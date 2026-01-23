import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/mongodb.config.js";
import urlSchema from "./src/models/shorturl.model.js";
import short_Url from "./src/routes/shortUrl.routes.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { redirectFromShortUrl } from "./src/controllers/shortUrl.controller.js";
import cors from "cors";
dotenv.config("./.env");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/create", short_Url);
app.get("/:id", redirectFromShortUrl);
app.use(errorHandler);


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

export default app;
