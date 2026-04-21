const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const EPK = require('../models/EPK');

// Signup page
router.get('/signup', (req, res) => {
  res.render('auth/signup', { error: null });
});

// Signup POST
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('artistName').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/signup', { 
      error: 'Please check your input and try again.' 
    });
  }

  const { email, password, artistName, genre } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/signup', { 
        error: 'Email already registered. Please login.' 
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      artistName,
      genre
    });

    await user.save();

    // Create initial EPK
    const slug = await EPK.generateSlug(artistName);
    const epk = new EPK({
      user: user._id,
      slug,
      artistName,
      genre
    });

    await epk.save();

    // Add EPK to user
    user.epks.push(epk._id);
    await user.save();

    // Set session
    req.session.user = {
      id: user._id,
      email: user.email,
      artistName: user.artistName,
      plan: user.plan
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    res.render('auth/signup', { 
      error: 'Something went wrong. Please try again.' 
    });
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// Login POST
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', { 
      error: 'Invalid email or password.' 
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { 
        error: 'Invalid email or password.' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { 
        error: 'Invalid email or password.' 
      });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      artistName: user.artistName,
      plan: user.plan
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { 
      error: 'Something went wrong. Please try again.' 
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
