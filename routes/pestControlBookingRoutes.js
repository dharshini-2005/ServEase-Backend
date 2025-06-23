const express = require('express');
const router = express.Router();
const PestControlBooking = require('../models/PestControlBooking');
const PestControlService = require('../models/PestControlService');

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[PestControlBooking] ${req.method} ${req.path}`);
  next();
});

// POST create new booking
router.post("/", async (req, res) => {
  try {
    const { bookings } = req.body;
    console.log('Creating new pest control bookings:', bookings);

    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    const savedBookings = await PestControlBooking.insertMany(bookings);
    console.log('Bookings created successfully:', savedBookings);
    res.status(201).json(savedBookings);
  } catch (error) {
    console.error('Error creating bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET customer's bookings
router.get("/customer/:customerEmail", async (req, res) => {
  try {
    const { customerEmail } = req.params;
    console.log('Fetching bookings for customer:', customerEmail);

    const bookings = await PestControlBooking.find({ customerEmail })
      .populate('serviceId');
    console.log(`Found ${bookings.length} bookings for customer ${customerEmail}`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET provider's bookings
router.get("/provider/:providerEmail", async (req, res) => {
  try {
    const { providerEmail } = req.params;
    console.log('Fetching bookings for provider:', providerEmail);

    const bookings = await PestControlBooking.find()
      .populate({
        path: 'serviceId',
        match: { providerEmail }
      })
      .then(bookings => bookings.filter(booking => booking.serviceId));

    console.log(`Found ${bookings.length} bookings for provider ${providerEmail}`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update booking status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log('Updating booking status:', id, status);

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedBooking = await PestControlBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('serviceId');

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log('Booking updated successfully:', updatedBooking);
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 