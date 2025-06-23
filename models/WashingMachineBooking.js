const mongoose = require("mongoose");

const WashingMachineBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WashingMachineService",
    required: true,
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
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  bookingDate: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
WashingMachineBookingSchema.index({ customerEmail: 1 });
WashingMachineBookingSchema.index({ providerEmail: 1 });
WashingMachineBookingSchema.index({ serviceId: 1 });
WashingMachineBookingSchema.index({ status: 1 });

// Add a method to format the booking data
WashingMachineBookingSchema.methods.toJSON = function() {
  const booking = this.toObject();
  booking.id = booking._id;
  delete booking._id;
  delete booking.__v;
  return booking;
};

const WashingMachineBooking = mongoose.model('WashingMachineBooking', WashingMachineBookingSchema);

// Create indexes if they don't exist
WashingMachineBooking.createIndexes().catch(console.error);

module.exports = WashingMachineBooking; 