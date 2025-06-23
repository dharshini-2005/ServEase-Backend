const mongoose = require('mongoose');

const cockroachAntandPestControlBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CockroachAntandPestControl',
    required: [true, 'Service ID is required']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
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
  areaSize: {
    type: String,
    required: true,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
cockroachAntandPestControlBookingSchema.index({ customerEmail: 1 });
cockroachAntandPestControlBookingSchema.index({ serviceId: 1 });
cockroachAntandPestControlBookingSchema.index({ status: 1 });
cockroachAntandPestControlBookingSchema.index({ scheduledDate: 1 });

const CockroachAntandPestControlBooking = mongoose.model('CockroachAntandPestControlBooking', cockroachAntandPestControlBookingSchema);

module.exports = CockroachAntandPestControlBooking; 