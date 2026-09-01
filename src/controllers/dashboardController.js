// src/controllers/dashboardController.js
const { getFreightForecast, getVesselFeasibility } = require('../services/mlClient');

async function getDashboardData(req, res) {
  try {
    const route = req.query.route || 'Australia-Paradip';

    const forecastPayload = { route, cargo_type: 'container' };
    const feasibilityPayload = {
      vessel_type: 'Panamax',
      loa_m: 225,
      beam_m: 32.2,
      draft_m: 12.0,
      cargo_weight_tons: 80000,
      port: 'Paradip',
      port_max_loa_m: 250,
      port_max_beam_m: 40,
      port_max_draft_m: 14.0
    };

    console.log('Sending to ML forecast:', forecastPayload);
    console.log('Sending to ML feasibility:', feasibilityPayload);

    const [forecast, feasibility] = await Promise.all([
      getFreightForecast(forecastPayload.route, forecastPayload.cargo_type),
      getVesselFeasibility(feasibilityPayload),
    ]);

    res.json({
      route,
      forecast,
      feasibility,
      recommendation: feasibility.risk_level === 'HIGH' ? 'WAIT' : 'BOOK',
    });
  } catch (err) {
    console.error('getDashboardData error:', err.message);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
}

module.exports = { getDashboardData };