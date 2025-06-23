const express = require("express");
const WashingMachineService = require("../models/WashingMachineService");
const router = express.Router();
const mongoose = require('mongoose');

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[WashingMachineService] ${req.method} ${req.path}`, req.body);
  next();
});

// GET route to fetch all washing machine services (for customers)
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all washing machine services');
    const services = await WashingMachineService.find();
    console.log(`Found ${services.length} services`);
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to fetch services'
    });
  }
});

// GET route to fetch washing machine services for a specific provider
router.get("/provider/:providerEmail", async (req, res) => {
  const { providerEmail } = req.params;
  console.log('Fetching services for provider:', providerEmail);
  
  try {
    const services = await WashingMachineService.find({ providerEmail });
    console.log(`Found ${services.length} services for provider ${providerEmail}`);
    
    if (!services || services.length === 0) {
      console.log('No services found for provider');
      return res.status(200).json([]);
    }
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to fetch provider services'
    });
  }
});

// POST route to add a new service
router.post("/", async (req, res) => {
  console.log('Received service creation request:', req.body);
  
  const { name, price, time, description, providerEmail } = req.body;

  // Log MongoDB connection state
  console.log('MongoDB connection state:', mongoose.connection.readyState);

  // Validate required fields
  if (!name || !price || !time || !description || !providerEmail) {
    console.log('Missing required fields:', { name, price, time, description, providerEmail });
    return res.status(400).json({ 
      message: "All fields are required",
      missingFields: {
        name: !name,
        price: !price,
        time: !time,
        description: !description,
        providerEmail: !providerEmail
      }
    });
  }

  // Validate price is a number
  if (isNaN(Number(price)) || Number(price) <= 0) {
    return res.status(400).json({ 
      message: "Price must be a positive number"
    });
  }

  try {
    console.log('Creating new service with data:', {
      name,
      price: Number(price),
      time,
      description,
      providerEmail
    });

    const service = new WashingMachineService({
      name,
      price: Number(price),
      time,
      description,
      providerEmail
    });

    console.log('Service object created:', service);

    const savedService = await service.save();
    console.log('Service created successfully:', savedService);

    res.status(201).json({
      message: "Service created successfully",
      service: savedService
    });
  } catch (error) {
    console.error('Error creating service:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate key error",
        field: Object.keys(error.keyPattern)[0]
      });
    }

    res.status(500).json({ 
      message: "Failed to create service",
      error: error.message,
      details: {
        name: error.name,
        code: error.code
      }
    });
  }
});

// Update service
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Updating service:', id, req.body);
  
  try {
    const service = await WashingMachineService.findById(id);
    if (!service) {
      console.log('Service not found:', id);
      return res.status(404).json({ message: "Service not found" });
    }

    // Validate price if it's being updated
    if (req.body.price && (isNaN(Number(req.body.price)) || Number(req.body.price) <= 0)) {
      return res.status(400).json({ 
        message: "Price must be a positive number"
      });
    }

    Object.assign(service, req.body);
    const updatedService = await service.save();
    console.log('Service updated successfully:', updatedService);
    
    res.json({
      message: "Service updated successfully",
      service: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Failed to update service'
    });
  }
});

// Delete service
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Deleting service:', id);
  
  try {
    const service = await WashingMachineService.findById(id);
    if (!service) {
      console.log('Service not found:', id);
      return res.status(404).json({ message: "Service not found" });
    }

    await service.deleteOne();
    console.log('Service deleted successfully:', id);
    
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to delete service'
    });
  }
});

module.exports = router; 