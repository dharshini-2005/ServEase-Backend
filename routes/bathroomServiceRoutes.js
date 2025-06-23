const express = require("express");
const router = express.Router();
const BathroomService = require("../models/BathroomService");

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[BathroomService] ${req.method} ${req.path}`, req.body);
  next();
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Bathroom service routes are working" });
});

// GET route to fetch bathroom services for a specific provider
router.get("/provider/:providerEmail", async (req, res) => {
  const { providerEmail } = req.params;
  console.log('Fetching services for provider:', providerEmail);
  
  try {
    const services = await BathroomService.find({ providerEmail }).lean();
    console.log(`Found ${services.length} services for provider ${providerEmail}`);
    
    // Transform the services to include id field
    const transformedServices = services.map(service => ({
      ...service,
      id: service._id,
      _id: service._id
    }));
    
    // Always return an array, even if empty
    res.status(200).json(transformedServices);
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch provider services',
      error: 'Failed to fetch provider services'
    });
  }
});

// GET route to fetch all bathroom services (for customers)
router.get("/", async (req, res) => {
  try {
    console.log('Fetching all bathroom services');
    const services = await BathroomService.find().lean();
    console.log(`Found ${services.length} services`);
    
    // Transform the services to include id field
    const transformedServices = services.map(service => ({
      ...service,
      id: service._id,
      _id: service._id
    }));
    
    res.status(200).json(transformedServices);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch services',
      error: 'Failed to fetch services'
    });
  }
});

// POST route to add a new service
router.post("/", async (req, res) => {
  console.log('Received service creation request:', req.body);
  
  const { name, price, time, description, providerEmail } = req.body;

  // Log each field for debugging
  console.log('Received fields:', {
    name: !!name,
    price: !!price,
    time: !!time,
    description: !!description,
    providerEmail: !!providerEmail
  });

  if (!name || !price || !time || !description || !providerEmail) {
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!price) missingFields.push('price');
    if (!time) missingFields.push('time');
    if (!description) missingFields.push('description');
    if (!providerEmail) missingFields.push('providerEmail');
    
    console.log('Missing required fields:', missingFields);
    return res.status(400).json({ 
      message: "All fields are required",
      missingFields 
    });
  }

  try {
    const service = new BathroomService({
      name,
      price: Number(price),
      time,
      description,
      providerEmail
    });

    console.log('Creating new service:', service);

    const savedService = await service.save();
    console.log('Service created successfully:', savedService);

    // Transform the service to include id field
    const transformedService = {
      ...savedService.toObject(),
      id: savedService._id,
      _id: savedService._id
    };

    res.status(201).json(transformedService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ 
      message: "Failed to create service",
      error: error.message,
      details: error.errors // Include validation errors if any
    });
  }
});

// Update service
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Updating service:', id, req.body);
  
  try {
    const service = await BathroomService.findById(id);
    if (!service) {
      console.log('Service not found:', id);
      return res.status(404).json({ message: "Service not found" });
    }

    Object.assign(service, req.body);
    const updatedService = await service.save();
    console.log('Service updated successfully:', updatedService);
    
    res.json(updatedService);
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
    const service = await BathroomService.findById(id);
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
