const express = require("express");
const PlumbingBooking = require("../models/PlumbingBooking");
const PlumbingService = require("../models/PlumbingService");
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`[PlumbingBooking] ${req.method} ${req.path}`, req.body);
  next();
});

// Get all bookings for a customer
router.get("/customer/:email", async (req, res) => {
  const { email } = req.params;
  console.log('Fetching bookings for customer:', email);
  
  try {
    const bookings = await PlumbingBooking.find({ customerEmail: email })
      .populate('serviceId');
    
    console.log(`Found ${bookings.length} bookings for customer ${email}`);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to fetch customer bookings'
    });
  }
});

// Create new booking
router.post("/", async (req, res) => {
  console.log('Received booking request:', req.body);
  
  const { bookings } = req.body;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(400).json({ 
      message: "Bookings array is required and must not be empty"
    });
  }

  try {
    // Validate all services exist
    const serviceIds = bookings.map(b => b.serviceId);
    const services = await PlumbingService.find({ _id: { $in: serviceIds } });
    
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ 
        message: "One or more services not found"
      });
    }

    // Create bookings
    const bookingPromises = bookings.map(booking => {
      const newBooking = new PlumbingBooking({
        serviceId: booking.serviceId,
        customerEmail: booking.customerEmail,
        status: 'pending',
        bookingDate: new Date()
      });
      return newBooking.save();
    });

    const savedBookings = await Promise.all(bookingPromises);
    console.log('Bookings created successfully:', savedBookings);

    res.status(201).json({
      message: "Bookings created successfully",
      bookings: savedBookings
    });
  } catch (error) {
    console.error('Error creating bookings:', error);
    res.status(500).json({ 
      message: "Failed to create bookings",
      error: error.message 
    });
  }
});

// Get booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await PlumbingBooking.findById(req.params.id)
      .populate('serviceId');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.put("/:id", async (req, res) => {
  try {
    const booking = await PlumbingBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    Object.assign(booking, req.body);
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await PlumbingBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
