const express = require('express');
const router = express.Router();
const CockroachAntandPestControl = require('../models/CockroachAntandPestControl');

// Debug middleware
router.use((req, res, next) => {
  console.log(`[CockroachAntandPestControl] ${req.method} ${req.path}`, req.body);
  next();
});

// Input validation middleware
const validateServiceInput = (req, res, next) => {
  const { name, price, time, description, providerEmail, serviceType, areaCoverage } = req.body;
  
  if (!name || !price || !time || !description || !providerEmail || !serviceType || !areaCoverage) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number' });
  }

  if (!['cockroach', 'ant', 'general'].includes(serviceType.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid service type' });
  }

  next();
};

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await CockroachAntandPestControl.find({ isAvailable: true });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get services by provider email
router.get('/provider/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const services = await CockroachAntandPestControl.find({ 
      providerEmail: email 
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get services by type
router.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type.toLowerCase();
    if (!['cockroach', 'ant', 'general'].includes(type)) {
      return res.status(400).json({ message: 'Invalid service type' });
    }

    const services = await CockroachAntandPestControl.find({ 
      serviceType: type,
      isAvailable: true
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services by type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new service
router.post('/', validateServiceInput, async (req, res) => {
  try {
    const service = new CockroachAntandPestControl(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating service:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update service
router.put('/:id', validateServiceInput, async (req, res) => {
  try {
    const service = await CockroachAntandPestControl.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider is updating their own service
    if (service.providerEmail !== req.body.providerEmail) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    Object.assign(service, req.body);
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await CockroachAntandPestControl.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider is deleting their own service
    if (service.providerEmail !== req.body.providerEmail) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Toggle service availability
router.patch('/:id/availability', async (req, res) => {
  try {
    const service = await CockroachAntandPestControl.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider is updating their own service
    if (service.providerEmail !== req.body.providerEmail) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    service.isAvailable = !service.isAvailable;
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error('Error toggling service availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 