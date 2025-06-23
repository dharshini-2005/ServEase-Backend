const express = require('express');
const router = express.Router();
const PestControlService = require('../models/PestControlService');

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[PestControlService] ${req.method} ${req.path}`);
  next();
});

// GET all pest control services
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all pest control services');
    const services = await PestControlService.find();
    console.log(`Found ${services.length} services`);
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET provider's pest control services
router.get("/provider/:providerEmail", async (req, res) => {
  try {
    const { providerEmail } = req.params;
    console.log('Fetching services for provider:', providerEmail);
    
    const services = await PestControlService.find({ providerEmail });
    console.log(`Found ${services.length} services for provider ${providerEmail}`);
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST new pest control service
router.post("/", async (req, res) => {
  try {
    const { name, price, time, description, providerEmail } = req.body;
    console.log('Creating new pest control service:', req.body);

    if (!name || !price || !time || !description || !providerEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = new PestControlService({
      name,
      price,
      time,
      description,
      providerEmail
    });

    const savedService = await newService.save();
    console.log('Service created successfully:', savedService);
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update pest control service
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, time, description } = req.body;
    console.log('Updating service:', id, req.body);

    const updatedService = await PestControlService.findByIdAndUpdate(
      id,
      { name, price, time, description },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    console.log('Service updated successfully:', updatedService);
    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE pest control service
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting service:', id);

    const deletedService = await PestControlService.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    console.log('Service deleted successfully');
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 