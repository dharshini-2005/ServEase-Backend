const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ElectricalBookingSchema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "ElectricalService",
    required: [true, "Service ID is required"],
    index: true
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is required"],
    trim: true,
    lowercase: true,
    index: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
    index: true
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Indexes for better query performance
ElectricalBookingSchema.index({ customerEmail: 1, bookingDate: -1 });
ElectricalBookingSchema.index({ serviceId: 1, status: 1 });

const ElectricalBooking = mongoose.model("ElectricalBooking", ElectricalBookingSchema);

module.exports = ElectricalBooking; 