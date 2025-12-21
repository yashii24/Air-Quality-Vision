const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { station, hours = 72} = req.body;
  try {
    const response = await axios.post(`${process.env.ML_API_URL}/forecast`, {
      station,
      hours
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Forecast service unavailable" });
  }
});


module.exports = router;

