const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Home Cleaning Booking Schema
const homeCleaningBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HomeCleaningService',
    required: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  providerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: {
    type: String,
    required: true
  },
  specialInstructions: {
    type: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const HomeCleaningBooking = mongoose.model('HomeCleaningBooking', homeCleaningBookingSchema);

// Debug middleware
router.use((req, res, next) => {
  console.log(`[HomeCleaningBooking] ${req.method} ${req.path}`, req.body);
  next();
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      serviceId,
      customerEmail,
      providerEmail,
      bookingDate,
      address,
      specialInstructions,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!serviceId || !customerEmail || !providerEmail || !bookingDate || !address || !totalAmount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['serviceId', 'customerEmail', 'providerEmail', 'bookingDate', 'address', 'totalAmount']
      });
    }

    // Create new booking
    const booking = new HomeCleaningBooking({
      serviceId,
      customerEmail,
      providerEmail,
      bookingDate: new Date(bookingDate),
      address,
      specialInstructions,
      totalAmount
    });

    const savedBooking = await booking.save();
    res.status(201).json({
      message: 'Booking created successfully',
      booking: savedBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      message: error.message
    });
  }
});

// Get all bookings for a customer
router.get('/customer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await HomeCleaningBooking.find({ customerEmail: email })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: error.message
    });
  }
});

// Get all bookings for a provider
router.get('/provider/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await HomeCleaningBooking.find({ providerEmail: email })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: error.message
    });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses: ['pending', 'confirmed', 'completed', 'cancelled']
      });
    }

    const booking = await HomeCleaningBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      error: 'Failed to update booking status',
      message: error.message
    });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await HomeCleaningBooking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel a completed booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      error: 'Failed to cancel booking',
      message: error.message
    });
  }
});

module.exports = router; 