console.log("✅ realtime.js route loaded");

const express = require("express");
const router = express.Router();
const {getRealtimeData} = require("../controllers/realtime.controller.js");

router.get("/test", (req, res) => {
  res.send("✅ /api/test is working");
});

router.get("/realtime", getRealtimeData);

console.log("✅ realtime.js route loaded.")

module.exports = router;
