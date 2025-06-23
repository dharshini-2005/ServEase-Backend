const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// Add a new service
router.post('/', async (req, res) => {
  const { name, price, time, description, providerEmail } = req.body;
  const newService = new Service({ name, price, time, description, providerEmail });
  await newService.save();
  res.status(201).json(newService);
});

// Update a service
router.put('/:id', async (req, res) => {
  const { name, price, time, description } = req.body;
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { name, price, time, description }, { new: true });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get services by provider email
router.get('/:providerEmail', async (req, res) => {
  const { providerEmail } = req.params;
  const services = await Service.find({ providerEmail });
  res.json(services);
});

module.exports = router;
