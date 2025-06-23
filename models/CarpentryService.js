const mongoose = require('mongoose');

const carpentryServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Time required is needed'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  providerEmail: {
    type: String,
    required: [true, 'Provider email is required'],
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
carpentryServiceSchema.index({ providerEmail: 1 });
carpentryServiceSchema.index({ name: 1 });

const CarpentryService = mongoose.model('CarpentryService', carpentryServiceSchema);

module.exports = CarpentryService;
