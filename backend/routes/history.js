const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// Fetch history of trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({}).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
