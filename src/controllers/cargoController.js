// src/controllers/cargoController.js
const { getVesselFeasibility } = require('../services/mlClient');

// Handles a new cargo requirement submission from cargoForm.html
async function submitCargo(req, res) {
  try {
    const { cargoType, quantityMT, vesselType, origin, destination } = req.body;

    if (!cargoType || !quantityMT || !vesselType || !origin || !destination) {
      return res.status(400).json({ error: 'Missing required cargo fields' });
    }

    const feasibility = await getVesselFeasibility({
      cargoType,
      quantityMT,
      vesselType,
      origin,
      destination,
    });

    res.json({
      input: { cargoType, quantityMT, vesselType, origin, destination },
      feasibility,
    });
  } catch (err) {
    console.error('submitCargo error:', err.message);
    res.status(500).json({ error: 'Failed to evaluate cargo requirement' });
  }
}

module.exports = { submitCargo };
