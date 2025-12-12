const express = require("express");
const router = express.Router();
console.log("📡 station.js route loaded");
const { getStationList } = require("../controllers/station.controller");

router.get("/stations", getStationList);

module.exports = router;
