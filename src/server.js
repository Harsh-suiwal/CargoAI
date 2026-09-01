// src/server.js
// Entry point for the CargoAI Express backend.
// Serves static frontend files, HTML views, and REST API routes.

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const cargoRoutes = require('./routes/cargoRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static assets (css, client-side js, images)
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Serve HTML "views" (dashboard, forecast, cargo form)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/forecast', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forecast.html'));
});

app.get('/cargo-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cargoForm.html'));
});

// API routes
app.use('/api/cargo', cargoRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`CargoAI backend running at http://localhost:${PORT}`);
});
