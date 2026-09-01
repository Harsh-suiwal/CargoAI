// src/controllers/dashboardController.js
const { getFreightForecast, getVesselFeasibility } = require('../services/mlClient');

// For the MVP, this returns a demo dashboard payload for the default route.
// Later, this will pull real cargo requirements from the database.
async function getDashboardData(req, res) {
  try {
    const route = req.query.route || 'Australia-Paradip';

    const [forecast, feasibility] = await Promise.all([
      getFreightForecast(route),
      getVesselFeasibility({
        cargoType: 'Coal',
        quantityMT: 80000,
        vesselType: 'Panamax',
        origin: 'Australia',
        destination: 'Paradip',
      }),
    ]);

    res.json({
      route,
      forecast,
      feasibility,
      recommendation: feasibility.risk === 'HIGH' ? 'WAIT' : 'BOOK',
    });
  } catch (err) {
    console.error('getDashboardData error:', err.message);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
}

module.exports = { getDashboardData };
