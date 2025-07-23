const express = require('express');
const router = express.Router();
const AqiData = require('../models/AqiData.js');
const {calculateCpcbAqi} = require('../utils/calculateCpcbAqi.js')

router.get('/aqi', async (req, res) => {
  console.log('✅ /api/aqi route HIT');

  const { station, date, hour } = req.query;

  if (!station || !date || !hour) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Format and normalize station
  const cleanedStation = station.trim().replace(/\s+/g, ' ');

  // Build timestamp string and convert to Date object
  const timestampStr = `${date} ${String(hour).padStart(2, '0')}:00:00`; 
 

  console.log('🕒 Looking for:', cleanedStation, timestampStr);

  try {
    console.log("🧪 Querying with:", {
      station: new RegExp(`^${cleanedStation}$`, 'i'),
      timestamp: timestampStr
    });
    const data = await AqiData.findOne({
      station: new RegExp(`^${cleanedStation}$`, 'i'), 
      timestamp: timestampStr, 
    });

    console.log("📦 Sample data:", data || null);
    if (!data){ 
      console.log("❌ No match for:", cleanedStation, timestampStr);
      return res.status(404).json({ error: 'No data found' });
    }

    const pollutants = data.pollutants;
    let aqiResult;
    try {
      aqiResult = calculateCpcbAqi({
        pm25: pollutants.PM25,
        pm10: pollutants.PM10,
        no2: pollutants.NO2,
        so2: pollutants.SO2,
        o3: pollutants.Ozone,
        co: pollutants.CO
      });
    } catch (err) {
      console.error("AQI Calculation Error:", err);
      return res.status(500).json({ error: "Failed to calculate AQI" });
    }

       
    // res.json(data);
    res.json({
      station: data.station,
      timestamp: data.timestamp,
      pollutants,
      aqi: aqiResult.aqi,
      dominant_pollutant: aqiResult.dominant,
      source: "Historical"
    });


  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
