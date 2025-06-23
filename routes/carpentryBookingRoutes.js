const express = require('express');
const router = express.Router();
const CarpentryBooking = require('../models/CarpentryBooking');
const CarpentryService = require('../models/CarpentryService');

// Debug middleware to log requests
router.use((req, res, next) => {
  console.log('Carpentry Booking Route:', req.method, req.url);
  console.log('Request body:', req.body);
  next();
});

// Get all bookings for a customer
router.get('/customer/:email', async (req, res) => {
  try {
    const bookings = await CarpentryBooking.find({ 
      customerEmail: req.params.email.toLowerCase() 
    }).populate('serviceId');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Create new booking(s)
router.post('/', async (req, res) => {
  try {
    const { bookings } = req.body;
    
    if (!bookings || !Array.isArray(bookings)) {
      return res.status(400).json({ 
        message: 'Bookings array is required',
        received: req.body
      });
    }

    // Validate each booking
    for (const booking of bookings) {
      if (!booking.serviceId || !booking.customerEmail) {
        return res.status(400).json({ 
          message: 'Service ID and customer email are required for each booking',
          invalidBooking: booking
        });
      }
    }

    // Create bookings
    const createdBookings = await CarpentryBooking.insertMany(bookings);
    res.status(201).json(createdBookings);
  } catch (error) {
    console.error('Error creating bookings:', error);
    res.status(500).json({ message: 'Error creating bookings', error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await CarpentryBooking.findById(req.params.id).populate('serviceId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        message: 'Valid status is required',
        received: { status }
      });
    }

    const updatedBooking = await CarpentryBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('serviceId');

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await CarpentryBooking.findByIdAndDelete(req.params.id);
    
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

module.exports = router; 