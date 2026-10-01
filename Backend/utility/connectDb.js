const mongoose = require("mongoose");

let isConnected = false;

const connectdb = async (url) => {
  const dbUrl = url || process.env.MONGO_URL;
  if (!dbUrl) {
    console.warn("MongoDB connection warning: MONGO_URL environment variable is missing.");
    return;
  }

  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const db = await mongoose.connect(dbUrl);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (!process.env.VERCEL) {
      // Don't kill process in serverless environments
    }
    throw error;
  }
};

module.exports = { connectdb };

