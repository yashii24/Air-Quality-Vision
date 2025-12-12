const RealtimeAQI = require('../models/realtimeAQI');
const { calculateCpcbAqi } = require('../utils/cpcbAqiCalculator');

async function getDailyAqi(req, res) {
  const { station, date } = req.query;
  const start = new Date(`${date}T00:00:00Z`);
  const end = new Date(`${date}T23:59:59Z`);

  const recs = await RealtimeAQI.find({ station, timestamp: { $gte: start, $lte: end } });
  if (recs.length === 0) return res.status(404).json({ error: "No data" });

  const sums = {}, counts = {};
  recs.forEach(r => {
    ['pm25','pm10','no2','so2','o3','co'].forEach(p => {
      if (r[p] != null) {
        sums[p] = (sums[p] || 0) + r[p];
        counts[p] = (counts[p] || 0) + 1;
      }
    });
  });

  const avg = {};
  Object.keys(sums).forEach(p => avg[p] = sums[p] / counts[p]);

  try {
    const { aqi, dominant } = calculateCpcbAqi(avg);
    res.json({ station, date, aqi, dominant, avg });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getDailyAqi };
