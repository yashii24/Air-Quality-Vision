const mongoose = require("mongoose");

const HourlyData = require("../models/HourlyData");

function parseTimestampToDate(ts) {
  if (!ts) return null;
  if (ts instanceof Date) return ts;
  if (typeof ts === "string") {
    return new Date(ts.replace(" ", "T") + "Z");
  }
  return null;
}

const getHourlyTrend = async (req, res) => {
  try {
    const { station, date, pollutant } = req.query;

    if (!station || !date || !pollutant) {
      return res.status(400).json({ message: "Missing query parameters" });
    }

    const startDate = new Date(`${date}T00:00:00Z`);
    const endDate = new Date(`${date}T23:59:59Z`);

    const startStr = `${date} 00:00:00`;
    const endStr = `${date} 23:59:59`;



    const query = {
      station,
      [`pollutants.${pollutant}`]: { $ne: null },
      timestamp: { $gte: startStr, $lte: endStr } // compare as string
    };

    const results = await HourlyData.find(query).sort({ timestamp: 1 }).lean();

    const data = results.map((doc) => {
      const dateObj = parseTimestampToDate(doc.timestamp);
      const hour = dateObj ? dateObj.getUTCHours() : null;
      return {
        hour,
        value: doc.pollutants ? doc.pollutants[pollutant] : null,
      };
    });

    res.json({ data });
  } catch (error) {
    console.error("Error in getHourlyTrend:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getDailyTrend = async (req, res) => {
  try {
    const { station, month, pollutant } = req.query;

    if (!station || !month || !pollutant) {
      return res.status(400).json({ message: "Missing query parameters" });
    }

    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

    const startStr = `${month}-01 00:00:00`;
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const endStr = `${month}-${String(daysInMonth).padStart(2, "0")} 23:59:59`;

    const query = {
      station,
      [`pollutants.${pollutant}`]: { $ne: null },
      timestamp: { $gte: startStr, $lte: endStr }
    };


    const results = await HourlyData.find(query).sort({ timestamp: 1 }).lean();

    const dailyValues = {};
    results.forEach((doc) => {
      const dateObj = parseTimestampToDate(doc.timestamp);
      if (!dateObj) return;
      const day = dateObj.getUTCDate();
      const dateStr = `${month}-${String(day).padStart(2, "0")}`;

      if (!dailyValues[dateStr]) dailyValues[dateStr] = [];
      dailyValues[dateStr].push(doc.pollutants[pollutant]);
    });

    const dailyAverages = {};
    for (const dateStr in dailyValues) {
      const values = dailyValues[dateStr].filter(v => v !== null && v !== undefined);
      dailyAverages[dateStr] = values.length
        ? parseFloat((values.reduce((s, v) => s + v, 0) / values.length).toFixed(2))
        : null;
    }

    const totalDays = daysInMonth;
    const data = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const dateStr = `${month}-${String(day).padStart(2, "0")}`;
      return {
        date: dateStr,
        value: dailyAverages[dateStr] ?? null,
      };
    });

    res.json({ data });
  } catch (error) {
    console.error("Error in getDailyTrend:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getHourlyTrend,
  getDailyTrend
};





























