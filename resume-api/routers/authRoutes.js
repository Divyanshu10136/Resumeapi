const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { user } = require('../models');

const router = express.Router();

function tokenFor(userRecord) {
  return jwt.sign(
    { id: userRecord.id, email: userRecord.email },
    process.env.JWT_SECRET || 'resumeflow-dev-secret',
    { expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await user.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const created = await user.create({ name, email, password });
    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: { id: created.id, name: created.name, email: created.email },
      token: tokenFor(created)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const record = await user.findOne({ where: { email } });
    if (!record || !(await bcrypt.compare(password, record.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      message: 'Login successful.',
      user: { id: record.id, name: record.name, email: record.email },
      token: tokenFor(record)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

router.post('/forget-password', (req, res) => {
  res.json({ success: true, message: 'Password reset flow can be connected to email service.' });
});

router.post('/reset-password', (req, res) => {
  res.json({ success: true, message: 'Reset-password endpoint is ready.' });
});

module.exports = router;
