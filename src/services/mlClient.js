// src/services/mlClient.js
// Talks to the separate Python ML service (cargoai-ml).
// The Python service runs on its own port (default 8000) and exposes /predict endpoints.

const fetch = require('node-fetch');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Get a freight rate forecast for a given route
async function getFreightForecast(route) {
  const res = await fetch(`${ML_SERVICE_URL}/forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ route }),
  });

  if (!res.ok) {
    throw new Error(`ML service error: ${res.status}`);
  }

  return res.json();
}

// Get vessel feasibility + risk score for a cargo/vessel/port combination
async function getVesselFeasibility(cargoDetails) {
  const res = await fetch(`${ML_SERVICE_URL}/feasibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cargoDetails),
  });

  if (!res.ok) {
    throw new Error(`ML service error: ${res.status}`);
  }

  return res.json();
}

module.exports = { getFreightForecast, getVesselFeasibility };
