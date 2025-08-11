const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const moment = require('moment');
const { MongoClient } = require('mongodb');

// MongoDB config
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'aqi_quality_database';
const collectionName = 'more_data';

// Pollutant key normalization map
const pollutantKeyMap = {
    'PM2.5': 'PM25',
    'PM25': 'PM25',
    'PM10': 'PM10',
    'NO': 'NO',
    'NO2': 'NO2',
    'NOx': 'NOx',
    'NH3': 'NH3',
    'SO2': 'SO2',
    'CO': 'CO',
    'Ozone': 'Ozone',
    'Benzene': 'Benzene',
    'Toluene': 'Toluene',
    'Xylene': 'Xylene',
    'Eth-Benzene': 'EthBenzene',
    'EthBenzene': 'EthBenzene',
    'MP-Xylene': 'MPXylene',
    'MPXylene': 'MPXylene',
    'O Xylene': 'Xylene',
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

// Parse numeric values safely
function parseValue(val) {
    return (val !== null && val !== 'None' && !isNaN(parseFloat(val))) ? parseFloat(val) : null;
}

async function processAndStoreData() {
    const dataDir = './More Data';

    try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const files = fs.readdirSync(dataDir);

        for (const file of files) {
            if (!file.endsWith('.xlsx')) continue;

            const filePath = path.join(dataDir, file);
            console.log(`Processing: ${filePath}`);

            // Clean station name
            let station = file
                .replace('.xlsx', '')
                .replace(' - DPCC', '')
                .replace(', Delhi', '')
                .trim();

            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

            // Find header row (contains 'From Date')
            const headerRowIndex = rawData.findIndex(row => row.includes('From Date'));
            if (headerRowIndex === -1) {
                console.warn(`⚠️ Skipping file (missing headers): ${file}`);
                continue;
            }

            const headers = rawData[headerRowIndex];
            const dataRows = rawData.slice(headerRowIndex + 1);

            for (const row of dataRows) {
                if (!row[0] || !row[1]) continue; // Skip invalid rows

                // Format timestamp to "YYYY-MM-DD HH:mm:ss"
                const timestampRaw = row[0] + ' ' + row[1];
                const timestamp = moment(timestampRaw, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');

                const document = {
                    station,
                    city: 'Delhi',
                    timestamp,
                    pollutants: {}
                };

                for (let i = 2; i < headers.length; i++) {
                    const rawKey = headers[i]?.trim();
                    if (!rawKey) continue;

                    const mappedKey = pollutantKeyMap[rawKey] || rawKey.replace(/\s+/g, '');
                    const val = row[i];

                    document.pollutants[mappedKey] = parseValue(val);
                }

                await collection.insertOne(document);
            }

            console.log(`✔ Imported ${dataRows.length} rows from: ${file}`);
        }

        console.log('✅ All files processed and saved to MongoDB.');
        await client.close();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

processAndStoreData();






