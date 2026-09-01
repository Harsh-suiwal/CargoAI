// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard -> combined forecast + vessel recommendation + risk alerts
router.get('/', dashboardController.getDashboardData);

module.exports = router;
