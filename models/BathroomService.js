const mongoose = require('mongoose');

const BathroomServiceSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
BathroomServiceSchema.index({ providerEmail: 1 });

// Add a method to format the service data
BathroomServiceSchema.methods.toJSON = function() {
  const service = this.toObject();
  service.id = service._id;
  delete service._id;
  delete service.__v;
  return service;
};

const BathroomService = mongoose.model('BathroomService', BathroomServiceSchema);

// Create indexes if they don't exist
BathroomService.createIndexes().catch(console.error);

module.exports = BathroomService;
