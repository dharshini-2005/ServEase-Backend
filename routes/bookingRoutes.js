const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const router = express.Router();

// Book a service
router.post('/', async (req, res) => {
  const { bookings } = req.body;

  const savedBookings = [];

  for (let i = 0; i < bookings.length; i++) {
    const { serviceId, customerEmail } = bookings[i];

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }

    const booking = new Booking({
      serviceId,
      customerEmail,
    });

    await booking.save();
    savedBookings.push(booking);
  }

  res.json({ success: true, message: "Booking successful!" });
});

module.exports = router;
