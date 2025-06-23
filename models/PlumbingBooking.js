const mongoose = require("mongoose");

const plumbingBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlumbingService",
    required: [true, "Service ID is required"],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is required"],
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
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
plumbingBookingSchema.index({ customerEmail: 1 });
plumbingBookingSchema.index({ serviceId: 1 });
plumbingBookingSchema.index({ status: 1 });

// Add a method to format the booking data
plumbingBookingSchema.methods.toJSON = function() {
  const booking = this.toObject();
  booking.id = booking._id;
  delete booking._id;
  delete booking.__v;
  return booking;
};

const PlumbingBooking = mongoose.model("PlumbingBooking", plumbingBookingSchema);

// Create indexes if they don't exist
PlumbingBooking.createIndexes().catch(console.error);

module.exports = PlumbingBooking;
