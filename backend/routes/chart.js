const express = require('express');
const router = express.Router();
const AqiData = require('../models/AqiData');

// Get hourly data for charts
router.get('/hourly', async (req, res) => {
  try {
    const { station, date, pollutant } = req.query;

    if (!station || !date) {
      return res.status(400).json({ error: 'Station and date are required' });
    }

    // Create date range (whole day)
    const start = `${date} 00:00:00`;
    const end = `${date} 23:59:59`;

    // Query database
    const data = await AqiData.find({
      station: new RegExp(`^${station}$`, 'i'),
      datetime: { $gte: start, $lte: end },
      [`pollutants.${pollutant.toUpperCase()}`]: { $exists: true }
    }).sort({ datetime: 1 });


    // Format response
    const result = data.map((entry) => ({
      time: entry.datetime.toISOString().slice(11, 16), // "HH:MM"
      value: entry.pollutants[pollutant.toUpperCase()]
    }));

    res.json(result);
  } catch (err) {
    console.error('Chart error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;







