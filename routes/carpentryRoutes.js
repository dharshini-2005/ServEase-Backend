const express = require('express');
const router = express.Router();
const CarpentryService = require('../models/CarpentryService');

// Add a new carpentry service (Provider)
router.post('/add', async (req, res) => {
  try {
    const { name, price, time, description, providerEmail } = req.body;

    // Validate the data
    if (!name || !price || !time || !description || !providerEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newService = new CarpentryService({
      name,
      price,
      time,
      description,
      providerEmail,
    });

    await newService.save();
    res.status(201).json({ message: 'Service added successfully', service: newService });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all carpentry services
router.get('/services', async (req, res) => {
  try {
    const services = await CarpentryService.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get services by provider
router.get('/services/:providerEmail', async (req, res) => {
  try {
    const providerServices = await CarpentryService.find({ providerEmail: req.params.providerEmail });
    res.status(200).json(providerServices);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
