const express = require('express');
const moment = require("moment");


const router = express.Router();
const { getRealtimeData } = require("../controllers/realtime.controller");
const { getAqiData } = require("../controllers/aqiController");

router.get('/', async (req, res) => {
  const { station, date, time } = req.query;

  if (!station || !date || !time) {
    return res.status(400).json({ error: 'Missing station, date, or time' });
  }

  const inputDate = moment(date, "YYYY-MM-DD");
  const today = moment().startOf("day");

  try {
    if (inputDate.isSame(today, "day")) {
      // ⏱ Real-time
      req.query.station = station;
      return getRealtimeData(req, res);
    } else {
      // 🕰️ Historical
      req.query.station = station;
      req.query.date = date;
      req.query.hour = parseInt(time); // convert "10:00" → 10
      return getAqiData(req, res);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
