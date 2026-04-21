const express = require('express');
const router = express.Router();
const EPK = require('../models/EPK');
const User = require('../models/User');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// View public EPK
router.get('/:slug', async (req, res) => {
  try {
    const epk = await EPK.findOne({ slug: req.params.slug, published: true })
      .populate('user', 'artistName');

    if (!epk) {
      return res.status(404).render('404');
    }

    // Increment view count
    epk.views += 1;
    epk.lastViewedAt = new Date();
    await epk.save();

    res.render('epk/view', { epk });
  } catch (error) {
    console.error('View EPK error:', error);
    res.status(500).send('Error loading EPK');
  }
});

// Edit EPK page
router.get('/:slug/edit', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).send('EPK not found');
    }

    res.render('epk/edit', { epk, user: req.session.user });
  } catch (error) {
    console.error('Edit EPK error:', error);
    res.status(500).send('Error loading EPK');
  }
});

// Update EPK
router.post('/:slug/update', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    // Update fields
    const updateFields = [
      'artistName', 'genre', 'bio', 'location', 'website'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        epk[field] = req.body[field];
      }
    });

    // Update social links
    if (req.body.socialLinks) {
      epk.socialLinks = { ...epk.socialLinks, ...req.body.socialLinks };
    }

    await epk.save();
    res.json({ success: true, epk });
  } catch (error) {
    console.error('Update EPK error:', error);
    res.status(500).json({ error: 'Error updating EPK' });
  }
});

// Add music track
router.post('/:slug/music', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    epk.music.push({
      platform: req.body.platform,
      url: req.body.url,
      title: req.body.title,
      description: req.body.description,
      embedCode: req.body.embedCode
    });

    await epk.save();
    res.json({ success: true, music: epk.music });
  } catch (error) {
    console.error('Add music error:', error);
    res.status(500).json({ error: 'Error adding music' });
  }
});

// Add video
router.post('/:slug/videos', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    epk.videos.push({
      platform: req.body.platform,
      url: req.body.url,
      title: req.body.title,
      embedId: req.body.embedId
    });

    await epk.save();
    res.json({ success: true, videos: epk.videos });
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({ error: 'Error adding video' });
  }
});

// Add press coverage
router.post('/:slug/press', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    epk.press.push({
      title: req.body.title,
      publication: req.body.publication,
      url: req.body.url,
      date: req.body.date,
      quote: req.body.quote
    });

    await epk.save();
    res.json({ success: true, press: epk.press });
  } catch (error) {
    console.error('Add press error:', error);
    res.status(500).json({ error: 'Error adding press coverage' });
  }
});

// Toggle publish status
router.post('/:slug/publish', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    epk.published = !epk.published;
    await epk.save();

    res.json({ success: true, published: epk.published });
  } catch (error) {
    console.error('Publish toggle error:', error);
    res.status(500).json({ error: 'Error updating publish status' });
  }
});

// Delete item from array
router.delete('/:slug/:collection/:itemId', requireAuth, async (req, res) => {
  try {
    const { slug, collection, itemId } = req.params;
    
    const epk = await EPK.findOne({ 
      slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    if (['music', 'videos', 'photos', 'press', 'shows'].includes(collection)) {
      epk[collection] = epk[collection].filter(
        item => item._id.toString() !== itemId
      );
      await epk.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;
