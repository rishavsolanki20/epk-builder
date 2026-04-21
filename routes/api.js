const express = require('express');
const router = express.Router();
const EPK = require('../models/EPK');
const User = require('../models/User');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get current user's EPK
router.get('/current', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('epks');
    
    if (!user || !user.epks || user.epks.length === 0) {
      return res.status(404).json({ error: 'No EPK found' });
    }

    // Return the first EPK (users can have multiple in future)
    res.json(user.epks[0]);
  } catch (error) {
    console.error('Get EPK error:', error);
    res.status(500).json({ error: 'Error fetching EPK' });
  }
});

// Get EPK statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('epks');
    
    if (!user || !user.epks || user.epks.length === 0) {
      return res.json({ views: 0, photos: 0, music: 0, press: 0 });
    }

    const epk = user.epks[0];
    
    res.json({
      views: epk.views || 0,
      photos: epk.photos?.length || 0,
      music: epk.music?.length || 0,
      videos: epk.videos?.length || 0,
      press: epk.press?.length || 0,
      shows: epk.shows?.length || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

module.exports = router;
