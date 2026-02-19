import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

let memoryServerInstance = null;

const maskUri = (uri = "") => uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");

const connectToUri = async (uri, label) => {
  console.log(`Connecting to MongoDB (${label})...`);
  console.log("Using URI:", maskUri(uri));

  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
  console.log(`Database: ${connection.connection.name}`);
  return connection;
};

const shouldUseMemoryFallback = () =>
  process.env.NODE_ENV !== "production" &&
  process.env.ALLOW_MEMORY_DB_FALLBACK !== "false";

const startMemoryMongo = async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");

  memoryServerInstance = await MongoMemoryServer.create({
    instance: { dbName: "snapurl-shortner" },
  });

  const memoryUri = memoryServerInstance.getUri();
  console.warn(
    "Atlas unavailable. Falling back to in-memory MongoDB for development.",
  );
  return memoryUri;
};

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  let lastError = null;

  if (primaryUri) {
    try {
      return await connectToUri(primaryUri, "primary");
    } catch (error) {
      lastError = error;
      console.error(`Primary MongoDB connection failed: ${error.message}`);
    }
  }

  if (shouldUseMemoryFallback()) {
    try {
      const memoryUri = await startMemoryMongo();
      return await connectToUri(memoryUri, "memory-fallback");
    } catch (error) {
      lastError = error;
      console.error(`In-memory MongoDB fallback failed: ${error.message}`);
    }
  }

  throw (
    lastError ||
    new Error("No MongoDB URI found. Set MONGODB_URI or MONGO_URI in .env")
  );
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error.message);
});

process.on("SIGINT", async () => {
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
});

export default connectDB;
