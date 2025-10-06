const express = require("express");
const router = express.Router();
const axios = require("axios");
const https = require("https");

// GET /api/live-banks
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://enachuat.npci.org.in:8086/apiservices_new/getLiveBankDtls",
      { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } 
    );

    // Send back liveBankList only
    res.json(response.data.liveBankList || []);
  } catch (err) {
    console.error("Failed to fetch live banks:", err.message);
    res.status(500).json({ error: "Failed to fetch live banks" });
  }
});

module.exports = router;
