const express = require('express');
const bcrypt = require('bcryptjs');
const Provider = require('../models/Provider');

const router = express.Router();

// Register a new provider
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newProvider = new Provider({ email, password: hashedPassword });
    await newProvider.save();

    res.json({ message: 'Provider registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login an existing provider
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
