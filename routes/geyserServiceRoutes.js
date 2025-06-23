const express = require('express');
const router = express.Router();
const GeyserService = require('../models/GeyserService');

// Get all services
router.get("/services", async (req, res) => {
  try {
    const services = await GeyserService.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get services by provider email
router.get("/provider/:providerEmail", async (req, res) => {
  try {
    console.log('Fetching services for provider:', req.params.providerEmail);
    const services = await GeyserService.find({ providerEmail: req.params.providerEmail });
    console.log('Found services:', services);
    
    if (!services || services.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add new service
router.post("/add-service", async (req, res) => {
  try {
    const service = new GeyserService(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update service
router.put("/:id", async (req, res) => {
  try {
    const service = await GeyserService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    Object.assign(service, req.body);
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service
router.delete("/:id", async (req, res) => {
  try {
    const service = await GeyserService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
