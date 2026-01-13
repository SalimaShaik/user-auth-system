const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');       // To encrypt passwords
const jwt = require('jsonwebtoken');    // To create tokens
const User = require('../models/User'); // Your User model

// ====== Signup Route ======
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== Login Route ======
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
