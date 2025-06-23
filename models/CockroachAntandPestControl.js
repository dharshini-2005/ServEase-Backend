const mongoose = require('mongoose');

const cockroachAntandPestControlSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    minlength: [3, 'Service name must be at least 3 characters long']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Price must be greater than 0'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d+\s*(hour|hr|hours|hrs)$/i.test(v);
      },
      message: 'Time must be in format like "2 hours" or "3 hrs"'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  providerEmail: {
    type: String,
    required: [true, 'Provider email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  serviceType: {
    type: String,
    enum: ['cockroach', 'ant', 'general'],
    required: [true, 'Service type is required']
  },
  areaCoverage: {
    type: String,
    required: [true, 'Area coverage is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d+\s*(sq\s*ft|square\s*feet|sq\s*m|square\s*meters)$/i.test(v);
      },
      message: 'Area coverage must be in format like "1000 sq ft" or "100 square meters"'
    }
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
cockroachAntandPestControlSchema.index({ providerEmail: 1 });
cockroachAntandPestControlSchema.index({ name: 1 });
cockroachAntandPestControlSchema.index({ serviceType: 1 });
cockroachAntandPestControlSchema.index({ isAvailable: 1 });

const CockroachAntandPestControl = mongoose.model('CockroachAntandPestControl', cockroachAntandPestControlSchema);

module.exports = CockroachAntandPestControl; 