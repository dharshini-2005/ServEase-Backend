const express = require("express");
const ACBooking = require("../models/ACBooking");
const ACService = require("../models/ACService");
const router = express.Router();

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[ACBooking] ${req.method} ${req.path}`, req.body);
  next();
});

// GET route to fetch bookings for a customer
router.get("/customer/:email", async (req, res) => {
  const { email } = req.params;
  console.log('Fetching bookings for customer:', email);
  
  try {
    const bookings = await ACBooking.find({ customerEmail: email })
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

// POST route to create new bookings
router.post("/", async (req, res) => {
  console.log('Received booking creation request:', req.body);
  
  const { bookings } = req.body;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(400).json({ 
      message: "Bookings array is required and must not be empty"
    });
  }

  try {
    // Validate all services exist
    const serviceIds = bookings.map(b => b.serviceId);
    const services = await ACService.find({ _id: { $in: serviceIds } });
    
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ 
        message: "One or more services not found"
      });
    }

    // Create bookings
    const bookingPromises = bookings.map(booking => {
      const newBooking = new ACBooking({
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

// Update booking status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log('Updating booking:', id, { status });
  
  if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ 
      message: "Valid status is required"
    });
  }

  try {
    const booking = await ACBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    console.log('Booking updated successfully:', updatedBooking);
    
    res.json({
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Failed to update booking'
    });
  }
});

// Delete booking
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Deleting booking:', id);
  
  try {
    const booking = await ACBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();
    console.log('Booking deleted successfully:', id);
    
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to delete booking'
    });
  }
});

module.exports = router;
