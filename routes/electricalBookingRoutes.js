const express = require("express");
const ElectricalBooking = require("../models/ElectricalBooking");
const ElectricalService = require("../models/ElectricalService");
const router = express.Router();

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`[ElectricalBooking] ${req.method} ${req.path}`, req.body);
  next();
});

// GET route to fetch all bookings for a customer
router.get("/customer/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;
  console.log('Fetching bookings for customer:', customerEmail);
  
  try {
    const bookings = await ElectricalBooking.find({ customerEmail })
      .populate('serviceId')
      .sort({ bookingDate: -1 });
    
    console.log(`Found ${bookings.length} bookings for customer ${customerEmail}`);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to fetch customer bookings'
    });
  }
});

// GET route to fetch all bookings for a provider
router.get("/provider/:providerEmail", async (req, res) => {
  const { providerEmail } = req.params;
  console.log('Fetching bookings for provider:', providerEmail);
  
  try {
    // First get all services for this provider
    const services = await ElectricalService.find({ providerEmail });
    const serviceIds = services.map(service => service._id);
    
    // Then get all bookings for these services
    const bookings = await ElectricalBooking.find({ serviceId: { $in: serviceIds } })
      .populate('serviceId')
      .sort({ bookingDate: -1 });
    
    console.log(`Found ${bookings.length} bookings for provider ${providerEmail}`);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to fetch provider bookings'
    });
  }
});

// POST route to create a new booking
router.post("/", async (req, res) => {
  console.log('Creating new booking:', req.body);
  const { serviceId, customerEmail } = req.body;

  if (!serviceId || !customerEmail) {
    return res.status(400).json({ 
      message: "Service ID and customer email are required"
    });
  }

  try {
    // Verify the service exists
    const service = await ElectricalService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = new ElectricalBooking({
      serviceId,
      customerEmail,
      status: 'pending',
      bookingDate: new Date()
    });

    const savedBooking = await booking.save();
    console.log('Booking created successfully:', savedBooking);
    
    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to create booking'
    });
  }
});

// PUT route to update booking status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log('Updating booking status:', id, status);

  if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ 
      message: "Valid status is required (pending, confirmed, completed, or cancelled)"
    });
  }

  try {
    const booking = await ElectricalBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    console.log('Booking status updated successfully:', updatedBooking);
    
    res.json({
      message: "Booking status updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to update booking status'
    });
  }
});

// DELETE route to cancel a booking
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log('Cancelling booking:', id);
  
  try {
    const booking = await ElectricalBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow cancellation of pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ 
        message: "Only pending or confirmed bookings can be cancelled"
      });
    }

    booking.status = 'cancelled';
    await booking.save();
    console.log('Booking cancelled successfully:', id);
    
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Failed to cancel booking'
    });
  }
});

module.exports = router; 