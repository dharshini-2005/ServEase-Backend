const express = require('express');
const router = express.Router();
const HomeCleaningService = require("../models/HomeCleaningService");
const WashingMachineService = require("../models/WashingMachineService");
const PlumbingService = require("../models/PlumbingService");
const SofaCarpetService = require("../models/SofaCarpetService");
const Booking = require("../models/Booking");

// Import all booking routes
const plumbingBookingRoutes = require('./plumbingBookingRoutes');
const electricalBookingRoutes = require('./electricalBookingRoutes');
const acBookingRoutes = require('./acBookingRoutes');
const carpentryBookingRoutes = require('./carpentryBookingRoutes');
const bathroomBookingRoutes = require('./bathroomBookingRoutes');
const geyserBookingRoutes = require('./geyserBookingRoutes');
const washingMachineBookingRoutes = require('./washingMachineBookingRoutes');
const televisionBookingRoutes = require('./televisionBookingRoutes');
const pestControlBookingRoutes = require('./pestControlBookingRoutes');
const sofaCarpetBookingRoutes = require('./sofaCarpetBookingRoutes');

// Mount all booking routes
router.use('/plumbing', plumbingBookingRoutes);
router.use('/electrical', electricalBookingRoutes);
router.use('/ac', acBookingRoutes);
router.use('/carpentry', carpentryBookingRoutes);
router.use('/bathroom-bookings', bathroomBookingRoutes);
router.use('/geyser', geyserBookingRoutes);
router.use('/washing-machine', washingMachineBookingRoutes);
router.use('/television', televisionBookingRoutes);
router.use('/pest-control', pestControlBookingRoutes);
router.use('/sofa-carpet', sofaCarpetBookingRoutes);

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[Bookings] ${req.method} ${req.path}`, req.body);
  next();
});

// Helper function to get service model based on type
const getServiceModel = (type) => {
  switch (type) {
    case 'home-cleaning':
      return HomeCleaningService;
    case 'washing-machine':
      return WashingMachineService;
    case 'plumbing':
      return PlumbingService;
    case 'sofa-carpet':
      return SofaCarpetService;
    default:
      // Log the invalid type to help debug
      console.error('Attempted to get service model for invalid type:', type);
      throw new Error('Invalid service type');
  }
};

// POST route to create bookings
router.post("/:serviceType", async (req, res) => {
  const { serviceType } = req.params;
  const { bookings } = req.body;

  console.log('Received booking request:', { serviceType, bookings });

  if (!bookings || !Array.isArray(bookings)) {
    console.log('Invalid bookings data:', bookings);
    return res.status(400).json({ message: "Invalid bookings data" });
  }

  try {
    const ServiceModel = getServiceModel(serviceType);
    console.log('Using service model:', ServiceModel.modelName);
    const bookingResults = [];

    for (const booking of bookings) {
      const { serviceId, customerEmail } = booking;
      console.log('Processing booking item:', { serviceId, customerEmail }); // Added item log

      try {
        // Verify service exists
        const service = await ServiceModel.findById(serviceId);
        console.log('Service lookup result for', serviceId + ':', service ? {
          id: service._id,
          name: service.name,
          price: service.price
        } : 'Not found'); // Added serviceId to log

        if (!service) {
          console.log(`Service not found, skipping booking for ID: ${serviceId}`); // Clarified log
          continue; // Skip this booking item if service not found
        }

        // Create booking record
        const newBooking = new Booking({
          serviceId,
          serviceType,
          customerEmail,
          providerEmail: service.providerEmail,
          serviceName: service.name,
          price: service.price,
          status: 'pending'
        });

        console.log('Attempting to save new booking:', {
          serviceId: newBooking.serviceId,
          serviceType: newBooking.serviceType,
          customerEmail: newBooking.customerEmail,
          providerEmail: newBooking.providerEmail,
          serviceName: newBooking.serviceName,
          price: newBooking.price
        });

        await newBooking.save();
        console.log('Successfully saved booking:', newBooking._id); // Added success save log
        bookingResults.push(newBooking);

      } catch (itemError) { // Catch errors for individual booking items
          console.error(`Error processing booking item for serviceId ${serviceId}:`, itemError); // Log the specific item error
          // Depending on desired behavior, you might stop processing or continue.
          // For now, we log and let the loop continue to process other items.
      }
    }

    if (bookingResults.length === 0) {
      console.log('No valid bookings to process after checking services'); // Clarified log
      // If the frontend sent bookings but none were valid (e.g., service not found for all), this returns 400
      return res.status(400).json({ message: "No valid bookings to process" });
    }

    console.log('Successfully created bookings:', bookingResults.map(booking => ({
      id: booking._id,
      serviceId: booking.serviceId,
      serviceName: booking.serviceName
    })));

    res.status(201).json({
      message: "Bookings created successfully",
      bookings: bookingResults
    });

  } catch (error) { // This catch handles errors from getServiceModel or unexpected issues
    console.error('Fatal error creating bookings:', error); // Clarified log as fatal
    res.status(500).json({ 
      message: "Failed to create bookings",
      error: error.message 
    });
  }
});

// GET route to fetch bookings for a customer
router.get("/customer/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;
  
  try {
    const bookings = await Booking.find({ customerEmail })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ 
      message: "Failed to fetch bookings",
      error: error.message 
    });
  }
});

// GET route to fetch bookings for a provider
router.get("/provider/:providerEmail", async (req, res) => {
  const { providerEmail } = req.params;
  
  try {
    const bookings = await Booking.find({ providerEmail })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ 
      message: "Failed to fetch bookings",
      error: error.message 
    });
  }
});

// PUT route to update booking status
router.put("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      message: "Booking status updated successfully",
      booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ 
      message: "Failed to update booking",
      error: error.message 
    });
  }
});

module.exports = router; 