const express = require("express");
const WashingMachineBooking = require("../models/WashingMachineBooking");
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`[WashingMachineBooking] ${req.method} ${req.path}`, req.body);
  next();
});

// POST route to create washing machine service bookings
router.post("/", async (req, res) => {
  console.log('Received booking request:', req.body);
  const { serviceId, customerEmail, providerEmail, bookingDate, address, totalAmount, specialInstructions } = req.body;

  // Validate required fields
  if (!serviceId || !customerEmail || !providerEmail || !bookingDate || !address || !totalAmount) {
    console.log('Missing required fields');
    return res.status(400).json({ 
      message: "Missing required fields",
      required: ['serviceId', 'customerEmail', 'providerEmail', 'bookingDate', 'address', 'totalAmount']
    });
  }

  try {
    console.log('Creating new booking with data:', req.body);
    const booking = new WashingMachineBooking({
      serviceId,
      customerEmail,
      providerEmail,
      bookingDate: new Date(bookingDate),
      address,
      specialInstructions,
      totalAmount,
      status: 'pending'
    });

    const savedBooking = await booking.save();
    console.log('Booking saved successfully:', savedBooking);
    
    res.status(201).json({ 
      success: true, 
      message: "Service booked successfully!",
      booking: savedBooking
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.stack
    });
  }
});

// GET route to fetch bookings for a customer
router.get("/customer/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;
  console.log('Fetching bookings for customer:', customerEmail);

  try {
    const bookings = await WashingMachineBooking.find({ customerEmail })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    console.log(`Found ${bookings.length} bookings for customer ${customerEmail}`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.stack
    });
  }
});

// GET route to fetch bookings for a provider
router.get("/provider/:providerEmail", async (req, res) => {
  const { providerEmail } = req.params;
  console.log('Fetching bookings for provider:', providerEmail);

  try {
    const bookings = await WashingMachineBooking.find({ providerEmail })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    console.log(`Found ${bookings.length} bookings for provider ${providerEmail}`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.stack
    });
  }
});

// Update booking status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
      validStatuses: ['pending', 'confirmed', 'completed', 'cancelled']
    });
  }

  try {
    const booking = await WashingMachineBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    
    res.json({
      message: "Booking status updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.stack
    });
  }
});

module.exports = router; 