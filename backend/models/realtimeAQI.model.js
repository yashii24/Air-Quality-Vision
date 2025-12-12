const mongoose = require("mongoose");

const RealtimeAQISchema = new mongoose.Schema({
  station: { type: String, required: true },
  city: { type: String, default: "Delhi" },
  timestamp: { type: String, required: true },
  pollutants: {
    PM25: Number,
    PM10: Number,
    NO: Number,
    NO2: Number,
    NOx: Number,
    NH3: Number,
    SO2: Number,
    CO: Number,
    Ozone: Number,
    Benzene: Number,
    Toluene: Number,
    Xylene: Number,
    OXylene: Number,
    EthBenzene: Number,
    MPXylene: Number,
    AT: Number,
    RH: Number,
    WS: Number,
    WD: Number,
    RF: Number,
    TOTRF: Number,
    SR: Number,
    BP: Number,
    VWS: Number,
  }
}, { collection: "hourly_data" });


RealtimeAQISchema.index({ station: 1, timestamp: 1 }, { unique: true });

module.exports = mongoose.model("RealtimeAQI", RealtimeAQISchema);