const mongoose = require("mongoose");

const carpentryBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarpentryService',
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
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
carpentryBookingSchema.index({ customerEmail: 1 });
carpentryBookingSchema.index({ serviceId: 1 });
carpentryBookingSchema.index({ status: 1 });

const CarpentryBooking = mongoose.model('CarpentryBooking', carpentryBookingSchema);

module.exports = CarpentryBooking; 