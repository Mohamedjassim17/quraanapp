const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const dotenv = require('dotenv');
dotenv.config();


// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
   
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.log(err);
    console.log('User model:', User);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Subscription Route
router.post('/update-subscription', async (req, res) => {
  const { userId, subscriptionPlan, subscriptionExpiration } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.subscriptionPlan = subscriptionPlan; // 'monthly' or 'yearly'
    user.subscriptionExpiration = subscriptionExpiration;
    await user.save();

    res.json({ msg: 'Subscription updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
