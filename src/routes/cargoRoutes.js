// src/routes/cargoRoutes.js
const express = require('express');
const router = express.Router();

// Handle the POST request from cargoForm.js
router.post('/', (req, res) => {
  const { cargoType, quantityMT, vesselType } = req.body;

  // MVP Mock Response matching EXACTLY what the frontend expects
  res.json({
    feasibility: {
      pass: true,
      risk: 'LOW',
      details: {
        // Just adding a bit of fake padding to the user's input so it looks realistic
        vesselDWT: quantityMT ? Number(quantityMT) + 15000 : 95000,
        portMaxDWT: 120000
      }
    }
  });
});

// Catch-all for accidental GET requests (so it doesn't crash if you visit it in the browser)
router.get('/', (req, res) => {
  res.json({ message: "Cargo API is active. Use POST to evaluate requirements." });
});

module.exports = router;