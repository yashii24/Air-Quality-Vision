const express = require("express");
const router = express.Router();
const { getHourlyTrend, getDailyTrend } = require("../controllers/trendController");


router.get("/hourly", getHourlyTrend);
router.get("/daily", getDailyTrend);

module.exports = router;
















// const express = require("express");
// const router = express.Router();
// const { getDb } = require("../utils/db");

// // 🧠 Mapping for frontend to DB keys
// const pollutantMap = {
//   "PM2.5": "PM25",
//   "PM10": "PM10",
//   "NO2": "NO2",
//   "O3": "Ozone",
//   "CO": "CO",
//   "SO2": "SO2",
//   "NO": "NO",
//   "NH3": "NH3",
//   "NOx": "NOx"
// };

// // GET /api/trend/hourly?station=Anand Vihar&date=2023-03-04&pollutant=PM2.5
// router.get("/trend/hourly", async (req, res) => {
//   const { station, date, pollutant } = req.query;
//   if (!station || !date || !pollutant) {
//     return res.status(400).json({ error: "Missing station, date, or pollutant" });
//   }

//   const db = getDb();
//   const pollutantKey = pollutantMap[pollutant] || pollutant;

//   const start = new Date(date);
//   const end = new Date(date);
//   end.setDate(end.getDate() + 1);

//   try {
//     const docs = await db.collection("hourly_data").find({
//       station,
//       timestamp: {
//         $gte: start,
//         $lt: end,
//       }
//     }).sort({ timestamp: 1 }).toArray();

//     // Transform to labels and values
//     const data = docs.map((doc) => {
//       return {
//         hour: new Date(doc.timestamp).toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//           timeZone: "Asia/Kolkata",
//         }),
//         value: doc.pollutants?.[pollutantKey] ?? null,
//       };
//     });

//     res.json({ data });
//   } catch (err) {
//     console.error("Error fetching hourly trend data:", err);
//     res.status(500).json({ error: "Failed to fetch hourly data" });
//   }
// });

// router.get("/trend/daily", async (req, res) => {
//   const { station, month, pollutant } = req.query;
//   if (!station || !month || !pollutant) {
//     return res.status(400).json({ error: "Missing station, month, or pollutant" });
//   }

//   const db = getDb();
//   const pollutantKey = pollutantMap[pollutant] || pollutant;

//   // Parse start & end of the given month
//   const [year, monthStr] = month.split("-");
//   const start = new Date(`${year}-${monthStr}-01T00:00:00Z`);
//   const end = new Date(start);
//   end.setMonth(end.getMonth() + 1); // Move to next month

//   try {
//     const data = await db.collection("hourly_data").aggregate([
//       {
//         $match: {
//           station,
//           timestamp: { $gte: start, $lt: end }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             day: {
//               $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
//             }
//           },
//           avgValue: { $avg: `$pollutants.${pollutantKey}` }
//         }
//       },
//       {
//         $sort: { "_id.day": 1 }
//       },
//       {
//         $project: {
//           _id: 0,
//           date: "$_id.day",
//           value: { $round: ["$avgValue", 2] }
//         }
//       }
//     ]).toArray();

//     res.json({ data });
//   } catch (err) {
//     console.error("Error fetching daily trend data:", err);
//     res.status(500).json({ error: "Failed to fetch daily trend data" });
//   }
// });

// module.exports = router;

