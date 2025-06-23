const express = require('express');
const router = express.Router();
const CarpentryService = require('../models/CarpentryService');

// Debug middleware to log requests
router.use((req, res, next) => {
  console.log('Carpentry Service Route:', req.method, req.url);
  console.log('Request body:', req.body);
  next();
});

// Get all carpentry services
router.get('/', async (req, res) => {
  try {
    const services = await CarpentryService.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching carpentry services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get services by provider email
router.get('/provider/:providerEmail', async (req, res) => {
  try {
    const services = await CarpentryService.find({ 
      providerEmail: req.params.providerEmail.toLowerCase() 
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({ message: 'Error fetching provider services', error: error.message });
  }
});

// Add new carpentry service
router.post('/', async (req, res) => {
  try {
    const { name, price, time, description, providerEmail } = req.body;
    
    // Validate required fields
    if (!name || !price || !time || !description || !providerEmail) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { name, price, time, description, providerEmail }
      });
    }

    const service = new CarpentryService({
      name,
      price,
      time,
      description,
      providerEmail: providerEmail.toLowerCase()
    });

    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating carpentry service:', error);
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

// Update carpentry service
router.put('/:id', async (req, res) => {
  try {
    const { name, price, time, description } = req.body;
    
    // Validate required fields
    if (!name || !price || !time || !description) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { name, price, time, description }
      });
    }

    const updatedService = await CarpentryService.findByIdAndUpdate(
      req.params.id,
      { name, price, time, description },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(updatedService);
  } catch (error) {
    console.error('Error updating carpentry service:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Delete carpentry service
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await CarpentryService.findByIdAndDelete(req.params.id);
    
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting carpentry service:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

module.exports = router; 