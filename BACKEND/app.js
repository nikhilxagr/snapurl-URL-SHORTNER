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

dotenv.config();

// ✅ Add this to verify env variables are loaded
console.log("🔧 Environment Check:");
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing",
);
console.log("APP_URL:", process.env.APP_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");

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

// ✅ Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  console.log("📦 Body:", req.body);
  next();
});

// Mount the routes - use only ONE prefix
app.use("/api/short_url", shortUrlRoutes);
app.use("/api", shortUrlRoutes); // ✅ Add this line - allows both /api/create and /api/short_url/create

app.use("/api/users", user_routes);
app.use("/api/auth", auth_routes);
app.get("/:id", redirectFromShortUrl);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    console.error("Please ensure MongoDB is running on your system.");
    process.exit(1);
  }
};

startServer();

export default app;
