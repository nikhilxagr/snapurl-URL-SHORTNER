import mongoose from "mongoose";
import dns from "dns";

// Set DNS to Google's public DNS to bypass ISP DNS issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    console.log("🔄 Connecting to MongoDB Atlas...");
    console.log(
      "📍 Using URI:",
      mongoURI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"),
    ); // Hide credentials

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Increase timeout for Atlas
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    if (
      error.message.includes("querySrv") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.error("\n⚠️  DNS Resolution Failed!");
      console.error("📌 Quick fixes:");
      console.error("   1. Disconnect VPN/Proxy and try again");
      console.error("   2. Run: ipconfig /flushdns (in cmd as admin)");
      console.error("   3. Change DNS to 8.8.8.8 in network settings");
      console.error("   4. Try mobile hotspot to test if ISP is blocking");
      console.error(
        "   5. Get standard (non-SRV) connection string from Atlas\n",
      );
    }

    throw error;
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

export default connectDB;
