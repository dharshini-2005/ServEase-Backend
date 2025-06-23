const mongoose = require("mongoose");

const TelevisionBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TelevisionService",
    required: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
TelevisionBookingSchema.index({ customerEmail: 1 });
TelevisionBookingSchema.index({ serviceId: 1 });
TelevisionBookingSchema.index({ status: 1 });

// Add a method to format the booking data when converting to JSON
TelevisionBookingSchema.methods.toJSON = function() {
  const booking = this.toObject();
  booking.id = booking._id;
  delete booking._id;
  delete booking.__v;
  return booking;
};

const TelevisionBooking = mongoose.model("TelevisionBooking", TelevisionBookingSchema);

module.exports = TelevisionBooking; 