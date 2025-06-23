const mongoose = require("mongoose");

const HomeCleaningServiceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Service name is required'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  time: { 
    type: String, 
    required: [true, 'Time is required'],
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
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
HomeCleaningServiceSchema.index({ providerEmail: 1 });
HomeCleaningServiceSchema.index({ name: 1 });

// Add a method to format the service data
HomeCleaningServiceSchema.methods.toJSON = function() {
  const service = this.toObject();
  service.id = service._id;
  delete service._id;
  delete service.__v;
  return service;
};

const HomeCleaningService = mongoose.model('HomeCleaningService', HomeCleaningServiceSchema);

// Create indexes if they don't exist
HomeCleaningService.createIndexes().catch(console.error);

module.exports = HomeCleaningService; 