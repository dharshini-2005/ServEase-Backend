const express = require("express");
const SofaCarpetService = require("../models/SofaCarpetService");
const router = express.Router();
const mongoose = require('mongoose');

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[SofaCarpetService] ${req.method} ${req.path}`, req.body);
  next();
});

// GET route to fetch all sofa carpet services (for customers)
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all sofa carpet services');
    const services = await SofaCarpetService.find();
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

// GET route to fetch sofa carpet services for a specific provider
router.get("/provider/:providerEmail", async (req, res) => {
  const { providerEmail } = req.params;
  console.log('Fetching services for provider:', providerEmail);
  
  try {
    const services = await SofaCarpetService.find({ providerEmail });
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
  
  const { name, price, time, description, providerEmail, type } = req.body;

  // Validate required fields
  if (!name || !price || !time || !description || !providerEmail || !type) {
    console.log('Missing required fields:', { name, price, time, description, providerEmail, type });
    return res.status(400).json({ 
      message: "All fields are required",
      missingFields: {
        name: !name,
        price: !price,
        time: !time,
        description: !description,
        providerEmail: !providerEmail,
        type: !type
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
    const service = new SofaCarpetService({
      name,
      price: Number(price),
      time,
      description,
      providerEmail,
      type
    });

    console.log('Creating new service:', service);

    const savedService = await service.save();
    console.log('Service created successfully:', savedService);

    res.status(201).json({
      message: "Service created successfully",
      service: savedService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ 
      message: "Failed to create service",
      error: error.message 
    });
  }
});

// Update service
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Updating service:', id, req.body);
  
  try {
    const service = await SofaCarpetService.findById(id);
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
    const service = await SofaCarpetService.findById(id);
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
