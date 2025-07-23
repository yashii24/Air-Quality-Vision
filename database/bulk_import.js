const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// ✅ Define MongoDB URI first!
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'air_quality';
const COLLECTION_NAME = 'hourly_data';

// ✅ CSV column to pollutant mapping
const fieldMap = {
  'PM2.5 (µg/m³)': 'PM25',
  'PM10 (µg/m³)': 'PM10',
  'NO (µg/m³)': 'NO',
  'NO2 (µg/m³)': 'NO2',
  'NOx (ppb)': 'NOx',
  'NH3 (µg/m³)': 'NH3',
  'SO2 (µg/m³)': 'SO2',
  'CO (mg/m³)': 'CO',
  'Ozone (µg/m³)': 'Ozone',
  'Benzene (µg/m³)': 'Benzene',
  'Toluene (µg/m³)': 'Toluene',
  'Xylene (µg/m³)': 'Xylene',
  'O Xylene': 'O Xylene',
  'EthBenzene': 'EthBenzene',
  'MPXylene': 'MPXylene',
  'AT': 'AT',
  'RH': 'RH',
  'WS': 'WS',
  'WD': 'WD',
  'RF': 'RF',
  'TOTRF': 'TOTRF',
  'SR': 'SR',
  'BP': 'BP',
  'VWS': 'VWS'
};

// ✅ Read and import one CSV file
async function importCSV(filePath, db) {
  return new Promise((resolve, reject) => {
    const records = [];
    const stationName = path
      .basename(path.dirname(filePath))
      .replace(/_/g, ' ');
    const city = 'Delhi';

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const pollutants = {};
        for (const [key, value] of Object.entries(row)) {
          const mappedKey = fieldMap[key.trim()];
          if (mappedKey) {
            pollutants[mappedKey] = value === '' || value === undefined ? null : parseFloat(value);
          }
        }

        const timestamp = new Date(row['Timestamp']);

        if (!isNaN(timestamp)) {
          records.push({
            station: stationName,
            city,
            timestamp,
            pollutants
          });
        }
      })
      .on('end', async () => {
        if (records.length > 0) {
          console.log(`📦 Inserting ${records.length} records into MongoDB...`);
          await db.collection(COLLECTION_NAME).insertMany(records);
          console.log(`✅ Data insertion complete for ${filePath}`);
        } else {
          console.log(`⚠️ No valid records found in ${filePath}`);
        }
        resolve();
      })
      .on('error', reject);
  });
}

// ✅ Loop through all folders and files
async function bulkImport() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const rawDataDir = path.join(__dirname, 'raw_data');
    const folders = fs.readdirSync(rawDataDir);

    for (const folder of folders) {
      const folderPath = path.join(rawDataDir, folder);
      if (fs.lstatSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.csv'));
        for (const file of files) {
          const filePath = path.join(folderPath, file);
          console.log(`📂 Reading file: ${filePath}`);
          await importCSV(filePath, db);
        }
      }
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.close();
  }
}

bulkImport();
