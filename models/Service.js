const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  providerEmail: { type: String, required: true }, // Link to the provider
});

module.exports = mongoose.model('Service', ServiceSchema);
