// src/routes/forecastRoutes.js
const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

// GET /api/forecast?route=Australia-Paradip -> freight forecast for a route
router.get('/', forecastController.getForecast);

module.exports = router;
