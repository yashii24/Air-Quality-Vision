// routes/station.js
const express = require("express");
const router = express.Router();
const { getStationList } = require("../controllers/station.controller");

router.get("/stations", getStationList);

module.exports = router;
