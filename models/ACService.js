const mongoose = require('mongoose');

const ACServiceSchema = new mongoose.Schema({
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
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ACService", ACServiceSchema);
