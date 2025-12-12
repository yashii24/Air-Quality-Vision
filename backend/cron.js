require("dotenv").config();
const cron = require("node-cron");
const axios = require("axios");
const mongoose = require("mongoose");
const RealTimeData = require("./models/realtimeAQI.model");
const { getWAQIStationName } = require("./utils/waqiStationMapper");


const stationNameMap = {
  "aya nagar": "Aya Nagar",
  "alipur": "Alipur",
  "anand vihar": "Anand Vihar",
  "Satyawati College": "Ashok Vihar",
  "pooth khurd, bawana": "Bawana",
  "burari crossing": "Burari Crossing",
  "crri mathura road": "CRRI Mathura Road",
  "dtu": "DTU",
  "national institute of malaria research": "Dwarka-Sector 8", 
  "dr. karni singh shooting range": "Dr. Karni Singh Shooting Range",
  "igi airport terminal 3": "IGI Airport (T3)",
  "ihbas": "IHBAS, Dilshad Garden",
  "ito": "ITO",
  "iti jahangirpuri": "Jahangirpuri",
  "jawaharlal nehru stadium": "Jawaharlal Nehru Stadium",
  "lodhi road": "Lodhi Road IMD",
  "mandir marg": "Mandir Marg",
  "major dhyan chand national stadium": "Major Dhyan Chand National Stadium",
  "mundka": "Mundka",
  "nsit dwarka": "NSIT Dwarka",
  "bramprakash ayurvedic hospital, najafgarh": "Najafgarh",
  "narela": "Narela",
  "PGDAV College": "Nehru Nagar",
  "north campus": "North Campus",
  "dite okhla": "Okhla Phase-2",
  "mother dairy plant": "Patparganj",
  "punjabi bagh": "Punjabi Bagh",
  "pusa": "Pusa",
  "r.k. puram": "R K Puram",
  "shaheed sukhdev college of business studies": "Rohini",
  "shadipur": "Shadipur",
  "sirifort": "Sirifort",
  "sonia vihar water treatment plant djb": "Sonia Vihar",
  "sri auribindo marg": "Sri Aurobindo Marg",
  "ITI Shahdra": "Vivek Vihar",
  "delhi institute of tool engineering": "Wazirpur",
};

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const stationsToFetch = [
  "Alipur",
  "Anand Vihar",
  "Ashok Vihar",
  "Bawana",
  "Dr. Karni Singh Shooting Range",
  "Dwarka-Sector 8",
  "ITO",
  "Jahangirpuri",
  "Jawaharlal Nehru Stadium",
  "Major Dhyan Chand National Stadium",
  "Mandir Marg",
  "Mundka",
  "Najafgarh",
  "Nehru Nagar",
  "Narela",
  "Okhla Phase-2",
  "Patparganj",
  "Punjabi Bagh",
  "Pusa",
  "R K Puram",
  "Rohini",
  "Sonia Vihar",
  "Sri Aurobindo Marg",
  "Vivek Vihar",
  "Wazirpur",
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Run every hour at minute 5
cron.schedule("* * * * *", async () => {
  console.log("⏰ Running cron job at", new Date().toLocaleString());

  // const apiUrl = `https://api.waqi.info/map/bounds/?latlng=28.4037,76.8378,28.8836,77.3473&token=${process.env.WAQI_TOKEN}`;
  const apiUrl = `https://api.waqi.info/map/bounds/?latlng=28.35,76.80,29.00,77.50&token=${process.env.WAQI_TOKEN}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data.status !== "ok") {
      console.error("❌ WAQI API error:", response.data);
      return;
    }

    const stations = response.data.data;
    console.log("📡 Stations fetched:", stations.length);

    const now = new Date();
    now.setMinutes(0, 0, 0); // Round to start of hour

    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in ms
    const istTime = new Date(now.getTime() + istOffset);

    // Format as "YYYY-MM-DD HH:mm:ss"
    const formattedIST = istTime.toISOString().replace("T", " ").substring(0, 19);

    for (const station of stations) {

      const uid = station.uid;
      const fullNameRaw = station.station.name || "Unknown";
      const fullNameNorm = normalizeName(fullNameRaw);

      let mappedStation = null;

      for (const key in stationNameMap) {
        if (fullNameNorm.includes(normalizeName(key))) {
          mappedStation = stationNameMap[key];
          break;
        }
      }

      const fallbackName = fullNameRaw.split(",")[0].trim();
      const stationName = mappedStation || fallbackName;

      if (!stationsToFetch.includes(stationName)) {
        continue;
      }
      
      console.log(`🟢 Fetching: ${stationName}`);


      try {
        const detailRes = await axios.get(`https://api.waqi.info/feed/@${uid}/?token=${process.env.WAQI_TOKEN}`);
        const detailData = detailRes.data.data;

        const entry = new RealTimeData({
          station: stationName,
          city: "Delhi",
          timestamp: formattedIST,
          pollutants: {
            PM25: detailData.iaqi?.pm25?.v || null,
            PM10: detailData.iaqi?.pm10?.v || null,
            NO2: detailData.iaqi?.no2?.v || null,
            Ozone: detailData.iaqi?.o3?.v || null,
            CO: detailData.iaqi?.co?.v || null,
            SO2: detailData.iaqi?.so2?.v || null,

            // Optional extras — may not be available, set to null if missing
            NO: detailData.iaqi?.no?.v || null,
            NOx: detailData.iaqi?.nox?.v || null,
            NH3: detailData.iaqi?.nh3?.v || null,
            Benzene: detailData.iaqi?.benzene?.v || null,
            Toluene: detailData.iaqi?.toluene?.v || null,
            Xylene: detailData.iaqi?.xylene?.v || null,
            OXylene: detailData.iaqi?.oxylene?.v || null,
            EthBenzene: detailData.iaqi?.ethbenzene?.v || null,
            MPXylene: detailData.iaqi?.mpxylene?.v || null,
            AT: detailData.iaqi?.at?.v || null,
            RH: detailData.iaqi?.rh?.v || null,
            WS: detailData.iaqi?.ws?.v || null,
            WD: detailData.iaqi?.wd?.v || null,
            RF: detailData.iaqi?.rf?.v || null,
            TOTRF: detailData.iaqi?.totrf?.v || null,
            SR: detailData.iaqi?.sr?.v || null,
            BP: detailData.iaqi?.bp?.v || null,
            VWS: detailData.iaqi?.vws?.v || null,
          }
        });

        await entry.save();
        console.log(`✅ Saved: ${stationName}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`⚠️ Duplicate skipped: ${stationName}`);
        } else {
          console.error(`❌ Error saving ${stationName}:`, err.message);
        }
      }
    }

    console.log("✅ All station data saved.");
  } catch (error) {
    console.error("❌ Cron job failed:", error.message);
  }
});




































