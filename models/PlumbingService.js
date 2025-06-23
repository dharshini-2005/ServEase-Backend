const mongoose = require("mongoose");

const plumbingServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  providerEmail: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create indexes for better query performance
plumbingServiceSchema.index({ providerEmail: 1 });
plumbingServiceSchema.index({ name: 1 });

// Add a method to format the service data
plumbingServiceSchema.methods.toJSON = function() {
  const service = this.toObject();
  service.id = service._id;
  delete service._id;
  delete service.__v;
  return service;
};

const PlumbingService = mongoose.model("PlumbingService", plumbingServiceSchema);

// Create indexes if they don't exist
PlumbingService.createIndexes().catch(console.error);

module.exports = PlumbingService;
