const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const stationRoutes = require("./routes/station");
const aqiRoutes = require("./routes/aqi");
const realtimeRoutes = require("./routes/realtime");
const dataRoutes = require('./routes/dataRoutes');
const mapRoutes = require('./routes/map')
const chartRoute = require("./routes/chart")
const trendRoutes = require("./routes/trend")
const forecastRouter = require("./routes/forecast")
const contactRoutes = require("./routes/contact")


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // local dev
      "https://air-quality-vision.vercel.app", // production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false, // keep false unless you use cookies
  })
);

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
app.use("/api/contact", contactRoutes)




app.get('/', (req, res) => {
  res.send('real time aqi is working');
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI not set; MongoDB features will be unavailable.');
    return;
  }

  mongoose
    .connect(mongoUri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message || err));
});

  
