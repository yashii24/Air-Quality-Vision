const axios = require("axios");
const {matchStationName} = require("../utils/stationMatcher")
const { getWAQIStationName } = require("../utils/waqiStationMapper");


const getRealtimeData = async (req, res) => {
  console.log("🔥 Hit /api/realtime route");

  const { station } = req.query;
  if (!station) {
    return res.status(400).json({ error: "Station parameter is required." });
  }

  const matchedStation = matchStationName(station);
  if (!matchedStation) {
    return res.status(404).json({ error: "Station not recognized. Try again with a valid name." });
  }

  const waqiStation = getWAQIStationName(matchedStation);
  if (!waqiStation) {
    return res.status(400).json({ error: "No WAQI mapping found for this station." });
  }


  console.log("👉 Matched Station for WAQI:", matchedStation);
  console.log("👉 WAQI Station Name Used:", waqiStation);


  try {
    const token = process.env.WAQI_TOKEN;
    const url = `https://api.waqi.info/feed/${encodeURIComponent(waqiStation)}/?token=${token}`;
    const response = await axios.get(url);
    console.log("🌐 WAQI Response:", response.data);

    
    if (response.data.status !== "ok") {
      return res.status(404).json({ error: "Station not found or data unavailable" });
    }

      const { aqi, iaqi, time } = response.data.data;

    const pollutants = {
      PM25: iaqi.pm25?.v ?? null,
      PM10: iaqi.pm10?.v ?? null,
      NO2: iaqi.no2?.v ?? null,
      SO2: iaqi.so2?.v ?? null,
      Ozone: iaqi.o3?.v ?? null,
      CO: iaqi.co?.v ?? null,
      NH3: iaqi.nh3?.v ?? null
    };

    const units = {
      PM25: "µg/m³",
      PM10: "µg/m³",
      NO2: "µg/m³",
      SO2: "µg/m³",
      Ozone: "µg/m³",
      NH3: "µg/m³",
      CO: "mg/m³"
    };


    res.status(200).json({
      source: 'WAQI',
      station: matchedStation,
      realtime_aqi: aqi,
      pollutants: Object.keys(pollutants).reduce((acc, key) => {
        if (pollutants[key] !== undefined && pollutants[key] !== null) {
          acc[key] = pollutants[key]
        }
        return acc;
      }, {}),
      time: time?.s || new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Error fetching real-time data:", error.message);
    res.status(500).json({ error: "Failed to fetch real-time data" });
  }
};

module.exports = { getRealtimeData };
























