const mongoose = require('mongoose');

const sofaCarpetBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SofaCarpetService',
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

const SofaCarpetBooking = mongoose.model('SofaCarpetBooking', sofaCarpetBookingSchema);

module.exports = SofaCarpetBooking;
