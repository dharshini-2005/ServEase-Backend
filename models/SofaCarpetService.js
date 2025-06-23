const mongoose = require('mongoose');

const sofaCarpetServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['sofa', 'carpet'],
    default: 'sofa'
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
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SofaCarpetService = mongoose.model('SofaCarpetService', sofaCarpetServiceSchema);

module.exports = SofaCarpetService;
