const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// const { connectDb } = require("./utils/db")

const stationRoutes = require("./routes/station");
const aqiRoutes = require("./routes/aqi");
const realtimeRoutes = require("./routes/realtime");
const dataRoutes = require('./routes/dataRoutes');
const mapRoutes = require('./routes/map')
const chartRoute = require("./routes/chart")
const trendRoutes = require("./routes/trend")
const forecastRouter = require("./routes/forecast")


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});


app.use("/api", aqiRoutes);
app.use("/api", realtimeRoutes);
app.use("/api", stationRoutes);
app.use("/api/data", dataRoutes);
app.use("/api", mapRoutes)
app.use("/api", chartRoute)
app.use("/api/trend", trendRoutes)
app.use("/api/forecast", forecastRouter) 



// connectDb().then(() => {
//     app.get('/', (req, res) => {
//       res.send('Real-time AQI API is working ✅');
//     });
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });




mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.get('/', (req,res) => {
        res.send('real time aqi is working')
    })

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  
