const express = require('express');
const router = express.Router();
const CockroachAntandPestControlBooking = require('../models/CockroachAntandPestControlBooking');
const CockroachAntandPestControl = require('../models/CockroachAntandPestControl');

// Debug middleware
router.use((req, res, next) => {
  console.log(`[CockroachAntandPestControlBooking] ${req.method} ${req.path}`, req.body);
  next();
});

// Input validation middleware
const validateBookingInput = (req, res, next) => {
  const { serviceId, customerEmail, scheduledDate, areaSize, address } = req.body;
  
  if (!serviceId || !customerEmail || !scheduledDate || !areaSize || !address) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  if (!customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const scheduledDateObj = new Date(scheduledDate);
  if (isNaN(scheduledDateObj.getTime()) || scheduledDateObj <= new Date()) {
    return res.status(400).json({ message: 'Scheduled date must be a valid future date' });
  }

  if (!areaSize.match(/^\d+\s*(sq\s*ft|square\s*feet|sq\s*m|square\s*meters)$/i)) {
    return res.status(400).json({ message: 'Invalid area size format' });
  }

  next();
};

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await CockroachAntandPestControlBooking.find()
      .populate('serviceId')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bookings by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const bookings = await CockroachAntandPestControlBooking.find({ 
      customerEmail: email 
    })
    .populate('serviceId')
    .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new booking
router.post('/', validateBookingInput, async (req, res) => {
  try {
    // Check if service exists and is available
    const service = await CockroachAntandPestControl.findById(req.body.serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    if (!service.isAvailable) {
      return res.status(400).json({ message: 'Service is not available' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await CockroachAntandPestControlBooking.findOne({
      serviceId: req.body.serviceId,
      scheduledDate: req.body.scheduledDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Service is already booked for this time slot' });
    }

    const booking = new CockroachAntandPestControlBooking(req.body);
    const savedBooking = await booking.save();
    const populatedBooking = await savedBooking.populate('serviceId');
    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await CockroachAntandPestControlBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the status transition is valid
    if (booking.status === 'completed' && status !== 'completed') {
      return res.status(400).json({ message: 'Cannot change status of a completed booking' });
    }

    if (booking.status === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Cannot change status of a cancelled booking' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    const populatedBooking = await updatedBooking.populate('serviceId');
    res.json(populatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await CockroachAntandPestControlBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Check if the cancellation is within allowed time (e.g., 24 hours before scheduled time)
    const scheduledDate = new Date(booking.scheduledDate);
    const now = new Date();
    const hoursUntilScheduled = (scheduledDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilScheduled < 24) {
      return res.status(400).json({ message: 'Cannot cancel booking less than 24 hours before scheduled time' });
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();
    const populatedBooking = await updatedBooking.populate('serviceId');
    res.json(populatedBooking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bookings by service provider
router.get('/provider/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const services = await CockroachAntandPestControl.find({ 
      providerEmail: email 
    });
    const serviceIds = services.map(service => service._id);
    
    const bookings = await CockroachAntandPestControlBooking.find({
      serviceId: { $in: serviceIds }
    })
    .populate('serviceId')
    .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 