const HistoricalAQI = require("../models/AqiData");

const getStationList = async (req, res) => {
  try {
    const stations = await HistoricalAQI.distinct("station");
    res.json({ stations });
  } catch (error) {
    console.error("Error fetching station list:", error.message);
    res.status(500).json({ error: "Failed to fetch station list" });
  }
};

module.exports = { getStationList };
