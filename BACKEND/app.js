import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRoutes from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";

dotenv.config("./.env");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    credentials: true, // 👈 this allows cookies to be sent
  }),
);

app.use(cookieParser());
app.use(attachUser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Mount the routes - use only ONE prefix
app.use("/api/short_url", shortUrlRoutes);

app.use("/api/users", user_routes);
app.use("/api/auth", auth_routes);
app.get("/:id", redirectFromShortUrl);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

export default app;
