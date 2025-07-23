const mongoose = require("mongoose");

const AqiDataSchema = new mongoose.Schema({
  station: String,
  city: String,
  timestamp: String,
  pollutants: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model("AqiData", AqiDataSchema, "hourly_data");