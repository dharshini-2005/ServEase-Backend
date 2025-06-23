const express = require("express");
const PlumbingService = require("../models/PlumbingService");
const router = express.Router();

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[PlumbingService] ${req.method} ${req.path}`, req.body);
  next();
});

// Get all plumbing services
router.get("/", async (req, res) => {
  try {
    const services = await PlumbingService.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get services by provider email
router.get("/provider/:email", async (req, res) => {
  try {
    const services = await PlumbingService.find({ providerEmail: req.params.email });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new plumbing service
router.post("/", async (req, res) => {
  try {
    const service = new PlumbingService(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update plumbing service
router.put("/:id", async (req, res) => {
  try {
    const service = await PlumbingService.findById(req.params.id);
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

// Delete plumbing service
router.delete("/:id", async (req, res) => {
  try {
    const service = await PlumbingService.findById(req.params.id);
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
