const { getDb } = require("../utils/db");

const getHourlyTrend = async (req, res) => {
  try {
    const db = getDb();

    const { station, date, pollutant } = req.query;

    if (!station || !date || !pollutant) {
      return res.status(400).json({ message: "Missing query parameters" });
    }

    const startDate = new Date(`${date}T00:00:00Z`);
    const endDate = new Date(`${date}T23:59:59Z`);


    const collection = db.collection("hourly_data");

    
    const results = await collection
      .find({
        station,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
        [`pollutants.${pollutant}`]: { $ne: null }
      })
      .sort({ timestamp: 1 })
      .toArray();

    const data = results.map((doc) => ({
      hour: new Date(doc.timestamp).getUTCHours(), // or .getHours() if using local time
      value: doc.pollutants[pollutant],
    }));

    res.json({ data });
  } catch (error) {
    console.error("Error in getHourlyTrend:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const getDailyTrend = async (req, res) => {
  try {
    const db = getDb();

    const { station, month, pollutant } = req.query;

    if (!station || !month || !pollutant) {
      return res.status(400).json({ message: "Missing query parameters" });
    }




    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

    const collection = db.collection("hourly_data");

    
    const results = await collection
      .find({
        station,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
        [`pollutants.${pollutant}`]: { $ne: null }
      })
      .sort({ timestamp: 1 })
      .toArray();

   
    const dailyValues = {};

    results.forEach((doc) => {
      const date = new Date(doc.timestamp) // Get day number (1-31)
      const day = date.getUTCDate();
      const dateStr = `${month}-${String(day).padStart(2, "0")}`;

      if (!dailyValues[dateStr]) {
         dailyValues[dateStr] = [];
      }

      
      dailyValues[dateStr].push(doc.pollutants[pollutant]);
    });

    const dailyAverages = {};
    for (const dateStr in dailyValues) {
      const values = dailyValues[dateStr];
      const avg =
        values.reduce((sum, val) => sum + val, 0) / values.length;
      dailyAverages[dateStr] = parseFloat(avg.toFixed(2));
    }


     const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
     const data = Array.from({ length: daysInMonth }, (_, i) => {
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
} 






























