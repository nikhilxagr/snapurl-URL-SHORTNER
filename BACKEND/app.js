import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRoutes from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import analytics_routes from "./src/routes/analytics.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

dotenv.config();

if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
  process.env.MONGODB_URI = process.env.MONGO_URI;
}

if (process.env.NODE_ENV !== "production") {
  console.log("Environment Check:");
  console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Missing");
  console.log("APP_URL:", process.env.APP_URL);
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");
}

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Too many URLs created, please try again later.",
});

app.use("/api/", limiter);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const isDatabaseReady = () => mongoose.connection.readyState === 1;

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    database: isDatabaseReady() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  if (isDatabaseReady()) return next();

  return res.status(503).json({
    status: "error",
    message:
      "Database is unavailable. Check MongoDB connection (Atlas IP whitelist) and try again.",
  });
});

app.use(attachUser);

app.use("/api/short_url", createLimiter, shortUrlRoutes);
app.use("/api/users", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/analytics", analytics_routes);

app.get("/:id", redirectFromShortUrl);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(errorHandler);

let isConnectingDatabase = false;

export const connectDatabaseWithRetry = async () => {
  if (isDatabaseReady() || isConnectingDatabase) return;

  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI (or MONGO_URI) in environment.");
    return;
  }

  isConnectingDatabase = true;
  try {
    await connectDB();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    setTimeout(connectDatabaseWithRetry, 15000);
  } finally {
    isConnectingDatabase = false;
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  if (process.env.NODE_ENV !== "test") {
    setTimeout(connectDatabaseWithRetry, 5000);
  }
});

export const startServer = () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });

  connectDatabaseWithRetry();
};

if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
