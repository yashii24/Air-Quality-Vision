const express = require("express");
const router = express.Router();
const { getHourlyTrend, getDailyTrend } = require("../controllers/trendController");


router.get("/hourly", getHourlyTrend);
router.get("/daily", getDailyTrend);

module.exports = router;
















