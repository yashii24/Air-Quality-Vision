const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { station, hours = 72 } = req.body;

  // Basic validation (safe & optional)
  if (!station) {
    return res.status(400).json({ error: "station is required" });
  }

  try {
    const response = await axios.post(
      `${process.env.ML_API_URL}/forecast`,
      {
        station,
        hours,
      },
      {
        timeout: 10000, // prevents hanging requests
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Forecast API error:", error.message);

    res.status(500).json({
      error: "Forecast service unavailable",
    });
  }
});

module.exports = router;

