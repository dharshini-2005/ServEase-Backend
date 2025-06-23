const mongoose = require("mongoose");

const ElectricalServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  providerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: Add an index for performance
ElectricalServiceSchema.index({ providerEmail: 1 });

const ElectricalService = mongoose.model("ElectricalService", ElectricalServiceSchema);

module.exports = ElectricalService; 