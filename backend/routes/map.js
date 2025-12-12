const express = require("express");
const axios = require("axios");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first"); 

const router = express.Router();


const api = axios.create({
  timeout: 8000, 
});


async function fetchWithRetry(url, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await api.get(url);
    } catch (err) {
      console.error(`⚠️ Attempt ${attempt} failed: ${err.code || err.message}`);

      // Final attempt → throw error
      if (attempt === retries) throw err;

      // Small delay before retry
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

router.get("/locations", async (req, res) => {
  try {
    const token = process.env.WAQI_TOKEN;
    if (!token) {
      return res
        .status(500)
        .json({ error: "WAQI token missing in .env file" });
    }

    const url = `https://api.waqi.info/map/bounds/?latlng=28.40,76.84,28.88,77.35&token=${token}`;

    // Fetch with retry
    const response = await fetchWithRetry(url);

    if (response.data.status !== "ok") {
      console.error("❌ WAQI Error:", response.data);
      return res
        .status(500)
        .json({ error: "WAQI returned error", details: response.data });
    }

    const stations = (response.data.data || []).map((s) => ({
      name: s.station?.name || "Unknown",
      latitude: s.lat,
      longitude: s.lon,
      aqi: s.aqi,
    }));

    return res.json(stations);
  } catch (err) {
    console.error("❌ Error in /api/locations:", err.message);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

module.exports = router;
