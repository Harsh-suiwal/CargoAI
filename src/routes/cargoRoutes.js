// src/routes/cargoRoutes.js
const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');

// POST /api/cargo -> submit a new cargo requirement
router.post('/', cargoController.submitCargo);

module.exports = router;
