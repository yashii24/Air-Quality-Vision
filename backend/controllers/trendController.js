const { getDb } = require("../utils/db");

function parseTimestampToDate(ts) {
  // ts may be a Date object or a string "YYYY-MM-DD HH:MM:SS"
  if (!ts) return null;
  if (ts instanceof Date) return ts;
  if (typeof ts === "string") {
    // Replace space with 'T' and append 'Z' to treat as UTC
    // e.g. "2025-01-01 00:00:00" -> "2025-01-01T00:00:00Z"
    return new Date(ts.replace(" ", "T") + "Z");
  }
  return null;
}

const getHourlyTrend = async (req, res) => {
  try {
    const db = getDb();
    const { station, date, pollutant } = req.query;

    if (!station || !date || !pollutant) {
      return res.status(400).json({ message: "Missing query parameters" });
    }

    // Range as Date objects
    const startDate = new Date(`${date}T00:00:00Z`);
    const endDate = new Date(`${date}T23:59:59Z`);

    // Range as strings matching your "YYYY-MM-DD HH:MM:SS" format
    const startStr = `${date} 00:00:00`;
    const endStr = `${date} 23:59:59`;

    const collection = db.collection("hourly_data");

    // Query handles two cases:
    // 1) timestamp is Date type and between startDate and endDate
    // 2) timestamp is String type and lexicographically between startStr and endStr
    const query = {
      station,
      [`pollutants.${pollutant}`]: { $ne: null },
      $or: [
        { $and: [{ timestamp: { $gte: startDate, $lte: endDate } }, { timestamp: { $type: "date" } }] },
        { $and: [{ timestamp: { $gte: startStr, $lte: endStr } }, { timestamp: { $type: "string" } }] }
      ]
    };

    const results = await collection.find(query).sort({ timestamp: 1 }).toArray();

    const data = results.map((doc) => {
      const dateObj = parseTimestampToDate(doc.timestamp);
      // Use UTC hours to match earlier behaviour — change to getHours() if you want local time instead
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
    const db = getDb();

    const { station, month, pollutant } = req.query;

    if (!station || !month || !pollutant) {
      return res.status(400).json({ message: "Missing query parameters" });
    }

    // month is "YYYY-MM"
    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1)); // exclusive end

    // string ranges for string timestamps
    const startStr = `${month}-01 00:00:00`;
    // compute last day of month for string upper bound (safe lexicographic compare)
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const endStr = `${month}-${String(daysInMonth).padStart(2, "0")} 23:59:59`;

    const collection = db.collection("hourly_data");

    const query = {
      station,
      [`pollutants.${pollutant}`]: { $ne: null },
      $or: [
        { $and: [{ timestamp: { $gte: startDate, $lt: endDate } }, { timestamp: { $type: "date" } }] },
        { $and: [{ timestamp: { $gte: startStr, $lte: endStr } }, { timestamp: { $type: "string" } }] }
      ]
    };

    const results = await collection.find(query).sort({ timestamp: 1 }).toArray();

    // aggregate per day
    const dailyValues = {};
    results.forEach((doc) => {
      const dateObj = parseTimestampToDate(doc.timestamp);
      if (!dateObj) return;
      // use UTC day for consistency with start/end above
      const day = dateObj.getUTCDate();
      const dateStr = `${month}-${String(day).padStart(2, "0")}`;

      if (!dailyValues[dateStr]) dailyValues[dateStr] = [];
      dailyValues[dateStr].push(doc.pollutants[pollutant]);
    });

    const dailyAverages = {};
    for (const dateStr in dailyValues) {
      const values = dailyValues[dateStr].filter(v => v !== null && v !== undefined);
      if (values.length === 0) {
        dailyAverages[dateStr] = null;
      } else {
        const avg = values.reduce((s, v) => s + v, 0) / values.length;
        dailyAverages[dateStr] = parseFloat(avg.toFixed(2));
      }
    }

    const totalDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
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
















// const { getDb } = require("../utils/db");

// const getHourlyTrend = async (req, res) => {
//   try {
//     const db = getDb();

//     const { station, date, pollutant } = req.query;

//     if (!station || !date || !pollutant) {
//       return res.status(400).json({ message: "Missing query parameters" });
//     }

//     const startDate = new Date(`${date}T00:00:00Z`);
//     const endDate = new Date(`${date}T23:59:59Z`);


//     const collection = db.collection("hourly_data");

    
//     const results = await collection
//       .find({
//         station,
//         timestamp: {
//           $gte: startDate,
//           $lte: endDate,
//         },
//         [`pollutants.${pollutant}`]: { $ne: null }
//       })
//       .sort({ timestamp: 1 })
//       .toArray();

//     const data = results.map((doc) => ({
//       hour: new Date(doc.timestamp).getUTCHours(), // or .getHours() if using local time
//       value: doc.pollutants[pollutant],
//     }));

//     res.json({ data });
//   } catch (error) {
//     console.error("Error in getHourlyTrend:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// const getDailyTrend = async (req, res) => {
//   try {
//     const db = getDb();

//     const { station, month, pollutant } = req.query;

//     if (!station || !month || !pollutant) {
//       return res.status(400).json({ message: "Missing query parameters" });
//     }




//     const startDate = new Date(`${month}-01T00:00:00Z`);
//     const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

//     const collection = db.collection("hourly_data");

    
//     const results = await collection
//       .find({
//         station,
//         timestamp: {
//           $gte: startDate,
//           $lte: endDate,
//         },
//         [`pollutants.${pollutant}`]: { $ne: null }
//       })
//       .sort({ timestamp: 1 })
//       .toArray();

   
//     const dailyValues = {};

//     results.forEach((doc) => {
//       const date = new Date(doc.timestamp) // Get day number (1-31)
//       const day = date.getUTCDate();
//       const dateStr = `${month}-${String(day).padStart(2, "0")}`;

//       if (!dailyValues[dateStr]) {
//          dailyValues[dateStr] = [];
//       }

      
//       dailyValues[dateStr].push(doc.pollutants[pollutant]);
//     });

//     const dailyAverages = {};
//     for (const dateStr in dailyValues) {
//       const values = dailyValues[dateStr];
//       const avg =
//         values.reduce((sum, val) => sum + val, 0) / values.length;
//       dailyAverages[dateStr] = parseFloat(avg.toFixed(2));
//     }


//      const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
//      const data = Array.from({ length: daysInMonth }, (_, i) => {
//       const day = i + 1;
//       const dateStr = `${month}-${String(day).padStart(2, "0")}`;
//       return {
//         date: dateStr,
//         value: dailyAverages[dateStr] ?? null,
//       };
//     });

//      res.json({ data });
//   } catch (error) {
//     console.error("Error in getDailyTrend:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };



// module.exports = {
//   getHourlyTrend,
//   getDailyTrend
// } 






























