const mongoose = require("mongoose");

const TelevisionServiceSchema = new mongoose.Schema({
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
    required: true
  },
  description: {
    type: String,
    required: true
  },
  providerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
TelevisionServiceSchema.index({ providerEmail: 1 });

module.exports = mongoose.model("TelevisionService", TelevisionServiceSchema); 