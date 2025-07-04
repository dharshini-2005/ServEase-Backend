const mongoose = require("mongoose");

const GeyserServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  providerEmail: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('GeyserService', GeyserServiceSchema);
