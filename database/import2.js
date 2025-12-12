// const fs = require('fs');
// const path = require('path');
// const xlsx = require('xlsx');
// const moment = require('moment');
// const { MongoClient } = require('mongodb');

// // MongoDB config
// const mongoUri = 'mongodb+srv://AirQualityVision:air-quality-vision-2025@air-quality-vision.ddiulhr.mongodb.net/air_quality?retryWrites=true&w=majority';
// const dbName = 'air_quality';
// const collectionName = 'hourly_data';

// // Pollutant key normalization map
// const pollutantKeyMap = {
//     'PM2.5': 'PM25',
//     'PM25': 'PM25',
//     'PM10': 'PM10',
//     'NO': 'NO',
//     'NO2': 'NO2',
//     'NOx': 'NOx',
//     'NH3': 'NH3',
//     'SO2': 'SO2',
//     'CO': 'CO',
//     'Ozone': 'Ozone',
//     'Benzene': 'Benzene',
//     'Toluene': 'Toluene',
//     'Xylene': 'Xylene',
//     'Eth-Benzene': 'EthBenzene',
//     'EthBenzene': 'EthBenzene',
//     'MP-Xylene': 'MPXylene',
//     'MPXylene': 'MPXylene',
//     'O Xylene': 'Xylene',
//     'AT': 'AT',
//     'RH': 'RH',
//     'WS': 'WS',
//     'WD': 'WD',
//     'RF': 'RF',
//     'TOTRF': 'TOTRF',
//     'SR': 'SR',
//     'BP': 'BP',
//     'VWS': 'VWS'
// };

// // Parse numeric values safely
// function parseValue(val) {
//     return (val !== null && val !== 'None' && !isNaN(parseFloat(val))) ? parseFloat(val) : null;
// }

// async function processAndStoreData() {
//     const dataDir = './Extended AQData';

//     try {
//         const client = new MongoClient(mongoUri);
//         await client.connect();
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         const files = fs.readdirSync(dataDir);
//         console.log('📁 Found files:', files);

//         for (const file of files) {
//             if (!file.endsWith('.xlsx')) continue;

//             const filePath = path.join(dataDir, file);
//             console.log(`Processing: ${filePath}`);

//             // Clean station name
//             let station = file
//                 .replace('.xlsx', '')
//                 .replace(' - DPCC', '')
//                 .replace(', Delhi', '')
//                 .trim();

//             const workbook = xlsx.readFile(filePath);
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];

//             const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//             // Find header row (contains 'From Date')
//             const headerRowIndex = rawData.findIndex(row => row.includes('From Date'));
//             if (headerRowIndex === -1) {
//                 console.warn(`⚠️ Skipping file (missing headers): ${file}`);
//                 continue;
//             }

//             const headers = rawData[headerRowIndex];
//             const dataRows = rawData.slice(headerRowIndex + 1);

//             for (const row of dataRows) {
//                 if (!row[0] || !row[1]) continue; // Skip invalid rows

//                 // Format timestamp to "YYYY-MM-DD HH:mm:ss"
//                 const timestampRaw = row[0] + ' ' + row[1];
//                 const timestamp = moment(timestampRaw, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');

//                 const document = {
//                     station,
//                     city: 'Delhi',
//                     timestamp,
//                     pollutants: {}
//                 };

//                 for (let i = 2; i < headers.length; i++) {
//                     const rawKey = headers[i]?.trim();
//                     if (!rawKey) continue;

//                     const mappedKey = pollutantKeyMap[rawKey] || rawKey.replace(/\s+/g, '');
//                     const val = row[i];

//                     document.pollutants[mappedKey] = parseValue(val);
//                 }

//                 await collection.insertOne(document);
//             }

//             console.log(`✔ Imported ${dataRows.length} rows from: ${file}`);
//         }

//         console.log('✅ All files processed and saved to MongoDB.');
//         await client.close();
//     } catch (error) {
//         console.error('❌ Error:', error);
//     }
// }

// processAndStoreData();






const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const moment = require("moment");
const { MongoClient } = require("mongodb");

// MongoDB config
const mongoUri = "mongodb+srv://AirQualityVision:air-quality-vision-2025@air-quality-vision.ddiulhr.mongodb.net/air_quality?retryWrites=true&w=majority";
const dbName = "air_quality";
const collectionName = "hourly_data";

// Pollutant normalization map
const pollutantKeyMap = {
  "PM2.5": "PM25",
  PM25: "PM25",
  PM10: "PM10",
  NO: "NO",
  NO2: "NO2",
  NOx: "NOx",
  NH3: "NH3",
  SO2: "SO2",
  CO: "CO",
  Ozone: "Ozone",
  Benzene: "Benzene",
  Toluene: "Toluene",
  Xylene: "Xylene",
  "Eth-Benzene": "EthBenzene",
  EthBenzene: "EthBenzene",
  "MP-Xylene": "MPXylene",
  MPXylene: "MPXylene",
  "O Xylene": "Xylene",
  AT: "AT",
  RH: "RH",
  WS: "WS",
  WD: "WD",
  RF: "RF",
  TOTRF: "TOTRF",
  SR: "SR",
  BP: "BP",
  VWS: "VWS",
};

// Safely convert numbers
function parseValue(val) {
  return val !== null && val !== "None" && !isNaN(parseFloat(val))
    ? parseFloat(val)
    : null;
}

async function processAndStoreData() {
  const dataDir = "./Data 11-10 to 4-12";

  try {
    console.log("📡 Connecting to MongoDB...");
    const client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log("🗑 Dropping indexes for faster import...");
    try {
      await collection.dropIndexes();
    } catch (err) {
      console.log("ℹ No indexes to drop.");
    }

    const files = fs.readdirSync(dataDir);
    console.log("📁 Found Excel files:", files);

    for (const file of files) {
      if (!file.endsWith(".xlsx")) continue;

      const filePath = path.join(dataDir, file);
      console.log(`\n📄 Processing file: ${file}`);

      // Clean station name
      let station = file
        .replace(".xlsx", "")
        .replace(" - DPCC", "")
        .replace(", Delhi", "")
        .trim();

      // Load Excel
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      // Locate headers (row containing 'From Date')
      const headerRowIndex = rawData.findIndex((r) =>
        r.includes("From Date")
      );

      if (headerRowIndex === -1) {
        console.warn(`⚠ Skipping (header row missing): ${file}`);
        continue;
      }

      const headers = rawData[headerRowIndex];
      const dataRows = rawData.slice(headerRowIndex + 1);

      console.log(`📊 Rows to import: ${dataRows.length}`);

      // BATCH INSERT LOGIC
      let batch = [];
      const BATCH_SIZE = 1000;
      let insertedCount = 0;

      for (const row of dataRows) {
        if (!row[0] || !row[1]) continue;

        const timestampRaw = row[0] + " " + row[1];
        const timestamp = moment(
          timestampRaw,
          "DD-MM-YYYY HH:mm"
        ).format("YYYY-MM-DD HH:mm:ss");

        const doc = {
          station,
          city: "Delhi",
          timestamp,
          pollutants: {},
        };

        for (let i = 2; i < headers.length; i++) {
          const rawKey = headers[i]?.trim();
          if (!rawKey) continue;

          const mapped = pollutantKeyMap[rawKey] || rawKey.replace(/\s+/g, "");
          doc.pollutants[mapped] = parseValue(row[i]);
        }

        batch.push(doc);

        if (batch.length >= BATCH_SIZE) {
          await collection.insertMany(batch);
          insertedCount += batch.length;
          console.log(`   ➕ Inserted batch of ${batch.length} (Total: ${insertedCount})`);
          batch = [];
        }
      }

      // Insert remaining rows
      if (batch.length > 0) {
        await collection.insertMany(batch);
        insertedCount += batch.length;
        console.log(`   ✔ Inserted final batch of ${batch.length}`);
      }

      console.log(`✅ Finished importing ${insertedCount} rows from ${file}`);
    }

    console.log("\n🔧 Rebuilding indexes (much faster after import)...");
    await collection.createIndex({ station: 1 });
    await collection.createIndex({ timestamp: 1 });

    console.log("🎉 DONE! All files imported successfully.");

    await client.close();
  } catch (err) {
    console.error("❌ Import failed:", err);
  }
}

// Run script
processAndStoreData();
