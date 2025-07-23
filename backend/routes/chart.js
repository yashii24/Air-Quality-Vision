const express = require('express');
const router = express.Router();
const AqiData = require('../models/AqiData');

// Get hourly data for charts
router.get('/hourly', async (req, res) => {
  try {
    const { station, date, pollutant } = req.query;

    if (!station || !date) {
      return res.status(400).json({ error: 'Station and date are required' });
    }

    // Create date range (whole day)
    const start = `${date} 00:00:00`;
    const end = `${date} 23:59:59`;

    // Query database
    const data = await AqiData.find({
      station: new RegExp(`^${station}$`, 'i'),
      datetime: { $gte: start, $lte: end },
      [`pollutants.${pollutant.toUpperCase()}`]: { $exists: true }
    }).sort({ datetime: 1 });


    // Format response
    const result = data.map((entry) => ({
      time: entry.datetime.toISOString().slice(11, 16), // "HH:MM"
      value: entry.pollutants[pollutant.toUpperCase()]
    }));

    res.json(result);
  } catch (err) {
    console.error('Chart error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;







// const express = require("express");
// const router = express.Router();
// const { getDb } = require("../utils/db");


// // GET /api/chart?station=...&pollutant=...&type=hourly|daily&date=...
// router.get("/", async (req, res) => {
//   const { station, pollutant, type = "hourly", date } = req.query;

//   if (!station || !pollutant) {
//     return res.status(400).json({ error: "Missing required parameters" });
//   }

//   try {
//     const db = getDb();
//     const collection = db.collection("hourly_data");

//     if (type === "hourly") {
//       // Return 24-hour values for a specific date
//       if (!date) return res.status(400).json({ error: "Date is required for hourly type" });

//       const data = await collection
//         .find({ station, pollutant, date })
//         .project({ _id: 0, hour: 1, value: 1 })
//         .sort({ hour: 1 })
//         .toArray();

//       return res.json(data);
//     }

//     if (type === "daily") {
//       // Aggregate daily average values over multiple days
//       const data = await collection.aggregate([
//         { $match: { station, pollutant } },
//         {
//           $group: {
//             _id: "$date",
//             averageValue: { $avg: "$value" }
//           }
//         },
//         {
//           $project: {
//             _id: 0,
//             date: "$_id",
//             value: { $round: ["$averageValue", 2] }
//           }
//         },
//         { $sort: { date: 1 } }
//       ]).toArray();

//       return res.json(data);
//     }

//     return res.status(400).json({ error: "Invalid type. Use 'hourly' or 'daily'." });
//   } catch (err) {
//     console.error("Chart API error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
