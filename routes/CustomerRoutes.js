const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      email,
      password: hashedPassword,
    });

    await newCustomer.save();
    res.json({ message: 'Customer registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
