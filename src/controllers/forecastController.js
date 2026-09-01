// src/controllers/forecastController.js
const { getFreightForecast } = require('../services/mlClient');

async function getForecast(req, res) {
  try {
    const route = req.query.route;
    if (!route) {
      return res.status(400).json({ error: 'Missing "route" query parameter' });
    }

    const forecast = await getFreightForecast(route);
    res.json(forecast);
  } catch (err) {
    console.error('getForecast error:', err.message);
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
}

module.exports = { getForecast };
