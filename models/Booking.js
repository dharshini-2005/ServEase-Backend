const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'serviceType'
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['home-cleaning', 'washing-machine', 'plumbing', 'sofa-carpet']
  },
  customerEmail: {
    type: String,
    required: true
  },
  providerEmail: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
bookingSchema.index({ customerEmail: 1 });
bookingSchema.index({ providerEmail: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Method to format the booking data
bookingSchema.methods.toJSON = function() {
  const booking = this.toObject();
  delete booking.__v;
  return booking;
};

const Booking = mongoose.model('Booking', bookingSchema);

// Create indexes
Booking.createIndexes().catch(err => {
  console.error('Error creating indexes for Booking model:', err);
});

module.exports = Booking;
