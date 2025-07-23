const AqiData = require("../models/AqiData");
const { calculateCpcbAqi } = require("../utils/calculateCpcbAqi"); 

exports.getAqiData = async (req, res) => {
  try {
    const { station, date, hour } = req.query;

    if (!station || !date || !hour) {
      return res.status(400).json({ error: "Missing required query params" });
    }

    // const timestamp = new Date(`${date}T${hour}:00:00Z`);
    const timestamp = `${date} ${String(hour).padStart(2, "0")}:00:00`;
    if (isNaN(timestamp.getTime())) {
      return res.status(400).json({ error: "Invalid date/hour format" });
    }
    

    const data = await AqiData.findOne({
      station,
      timestamp,
    });

    if (!data) {
      return res.status(404).json({ error: "No data found" });
    }

    let calculatedAqi;
    try {
      calculatedAqi = calculateCpcbAqi({
        pm25: data.pollutants.PM25,
        pm10: data.pollutants.PM10,
        no2: data.pollutants.NO2,
        so2: data.pollutants.SO2,
        o3: data.pollutants.Ozone,
        co: data.pollutants.CO
      });
    } catch (calcError) {
      console.error("AQI Calculation Failed:", calcError.message);
      return res.status(422).json({ 
        error: "Could not calculate AQI",
        details: calcError.message,
        pollutants: data.pollutants
      });
    }

    


    res.json({
      ...data.toObject(),
      calculatedAqi : calculatedAqi.aqi,
      dominant_pollutant: calculatedAqi.dominant,
      source: "Historical"
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
