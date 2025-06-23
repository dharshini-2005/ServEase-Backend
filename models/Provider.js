const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
