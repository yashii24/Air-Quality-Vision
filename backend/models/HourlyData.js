const mongoose = require('mongoose');

const pollutantSchema = new mongoose.Schema({
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
  O_Xylene: Number,
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
  VWS: Number
}, { _id: false });

const hourlyDataSchema = new mongoose.Schema({
  station: String,
  city: String,
  // timestamp: Date,
  timestamp : String,
  pollutants: pollutantSchema
}, { collection: "hourly_data" });

module.exports = mongoose.model('HourlyData', hourlyDataSchema);
