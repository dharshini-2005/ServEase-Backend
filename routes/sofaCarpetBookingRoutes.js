const express = require('express');
const router = express.Router();
const SofaCarpetBooking = require('../models/SofaCarpetBooking');
const SofaCarpetService = require('../models/SofaCarpetService');

// Create multiple bookings
router.post('/', async (req, res) => {
  try {
    const { bookings } = req.body;
    const createdBookings = [];

    for (const bookingData of bookings) {
      const service = await SofaCarpetService.findById(bookingData.serviceId);
      if (!service) {
        return res.status(404).json({ message: `Service with ID ${bookingData.serviceId} not found` });
      }

      const booking = new SofaCarpetBooking({
        serviceId: bookingData.serviceId,
        customerEmail: bookingData.customerEmail,
        totalAmount: service.price,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to next day
      });

      const savedBooking = await booking.save();
      createdBookings.push(savedBooking);
    }

    res.status(201).json(createdBookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get bookings by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const bookings = await SofaCarpetBooking.find({ customerEmail: req.params.email })
      .populate('serviceId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by provider email
router.get('/provider/:email', async (req, res) => {
  try {
    const services = await SofaCarpetService.find({ providerEmail: req.params.email });
    const serviceIds = services.map(service => service._id);
    const bookings = await SofaCarpetBooking.find({ serviceId: { $in: serviceIds } })
      .populate('serviceId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/:id', async (req, res) => {
  try {
    const booking = await SofaCarpetBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.body.status) {
      booking.status = req.body.status;
    }
    if (req.body.scheduledDate) {
      booking.scheduledDate = req.body.scheduledDate;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await SofaCarpetBooking.findById(req.params.id)
      .populate('serviceId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
