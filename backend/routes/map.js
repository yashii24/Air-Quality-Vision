const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get all Delhi station data (real-time)
router.get('/locations', async (req, res) => {
  try {
    const token = process.env.WAQI_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "WAQI token not set in .env" });
    }

    const url = `https://api.waqi.info/map/bounds/?latlng=28.40,76.84,28.88,77.35&token=${token}`;

    const response = await axios.get(url);

    if (response.data.status !== 'ok') {
      return res.status(500).json({ error: "Failed to fetch data from WAQI" });
    }

    const stations = response.data.data.map((station) => ({
      name: station.station.name,
      latitude: station.lat,
      longitude: station.lon,
      aqi: station.aqi,
    }));

    res.json(stations);
  } catch (err) {
    console.error("❌ Error in /api/locations:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
