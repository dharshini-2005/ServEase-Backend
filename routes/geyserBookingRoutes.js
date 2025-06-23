const express = require("express");
const router = express.Router();
const GeyserBooking = require("../models/GeyserBooking");
const GeyserService = require("../models/GeyserService");

// Create multiple bookings
router.post("/", async (req, res) => {
  const { bookings } = req.body;
  const savedBookings = [];

  try {
    for (let booking of bookings) {
      const service = await GeyserService.findById(booking.serviceId);
      if (!service) {
        return res.status(400).json({ message: "Service not found" });
      }

      const newBooking = new GeyserBooking({
        serviceId: booking.serviceId,
        customerEmail: booking.customerEmail
      });
      
      await newBooking.save();
      savedBookings.push(newBooking);
    }

    res.status(201).json({ 
      success: true, 
      message: "Bookings created successfully",
      bookings: savedBookings 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by customer email
router.get("/customer/:email", async (req, res) => {
  try {
    const bookings = await GeyserBooking.find({ customerEmail: req.params.email })
      .populate('serviceId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch("/:id", async (req, res) => {
  try {
    const booking = await GeyserBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.body.status) {
      booking.status = req.body.status;
    }
    
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
