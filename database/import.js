const fs = require('fs');
const csv = require('csv-parser');
const dayjs = require('dayjs');
const { MongoClient } = require('mongodb');

// === CONFIGURATION ===
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'database';
const collectionName = "hourly_data";

const city = "Delhi";
const station = "R K Puram";
const year = "2024";
const fileName = "R_K_Puram_Delhi_DPCC_2024.csv";
const filePath = 'D:/project/Air Quality Main/database/raw_data/R K Puram/R_K_Puram_Delhi_DPCC_2017.csv'; // Change this per file


const cleanHeader = (header) => {
  return header
    .replace(/\(.*?\)/g, "") // Remove anything in parentheses
    .replace(/[^\w\s]/g, "")  // Remove special characters
    .trim();
};

// === Main Insertion Function ===
async function importCSV() {
  const client = new MongoClient(mongoURI);
  const records = [];

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log(`📂 Reading file: ${filePath}`);
    const headersMap = {};

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          headers.forEach((h) => {
            headersMap[h] = cleanHeader(h);
          });
        })
        .on("data", (row) => {
          const cleaned = {
            station,
            city,
            timestamp: row["Timestamp"],
            pollutants: {},
          };

          for (const key in row) {
            if (key !== "Timestamp") {
              const value = parseFloat(row[key]);
              cleaned.pollutants[headersMap[key]] = isNaN(value) ? null : value;
            }
          }
          records.push(cleaned);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`📦 Inserting ${records.length} records into MongoDB...`);
    if (records.length > 0) await collection.insertMany(records);
    console.log("✅ Data insertion complete!");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  } finally {
    await client.close();
  }
}

importCSV();

