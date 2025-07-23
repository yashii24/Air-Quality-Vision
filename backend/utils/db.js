// /db.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectDb() {
  await client.connect();
  db = client.db("air_quality"); // change to your DB name
  console.log("Connected to MongoDB");
}

function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
}

module.exports = { connectDb, getDb };












// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;