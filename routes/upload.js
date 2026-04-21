const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const EPK = require('../models/EPK');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/photos');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Audio file storage configuration
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/audio');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const audioFileFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|m4a|aac/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /audio/.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'), false);
  }
};

const audioUpload = multer({
  storage: audioStorage,
  fileFilter: audioFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for audio
});

// Upload photo
router.post('/photo/:slug', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    // Optimize image with sharp
    const optimizedFilename = 'optimized-' + req.file.filename;
    const optimizedPath = path.join(__dirname, '../uploads/photos', optimizedFilename);

    await sharp(req.file.path)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);

    // Add photo to EPK
    epk.photos.push({
      url: '/uploads/photos/' + optimizedFilename,
      caption: req.body.caption || '',
      isProfile: req.body.isProfile === 'true'
    });

    // If this is set as profile, unset others
    if (req.body.isProfile === 'true') {
      epk.photos.forEach((photo, index) => {
        if (index !== epk.photos.length - 1) {
          photo.isProfile = false;
        }
      });
    }

    await epk.save();

    res.json({ 
      success: true, 
      photo: epk.photos[epk.photos.length - 1] 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading photo' });
  }
});

// Delete photo
router.delete('/photo/:slug/:photoId', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    epk.photos = epk.photos.filter(
      photo => photo._id.toString() !== req.params.photoId
    );

    await epk.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Error deleting photo' });
  }
});

// Upload audio/MP3 file
router.post('/audio/:slug', requireAuth, audioUpload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    // Add audio to EPK
    epk.music.push({
      platform: 'upload',
      title: req.body.title || req.file.originalname.replace(/\.[^/.]+$/, ''),
      description: req.body.description || '',
      filePath: '/uploads/audio/' + req.file.filename,
      fileSize: req.file.size
    });

    await epk.save();

    res.json({ 
      success: true, 
      audio: epk.music[epk.music.length - 1] 
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Error uploading audio file' });
  }
});

// Delete audio
router.delete('/audio/:slug/:audioId', requireAuth, async (req, res) => {
  try {
    const epk = await EPK.findOne({ 
      slug: req.params.slug, 
      user: req.session.user.id 
    });

    if (!epk) {
      return res.status(404).json({ error: 'EPK not found' });
    }

    epk.music = epk.music.filter(
      track => track._id.toString() !== req.params.audioId
    );

    await epk.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Delete audio error:', error);
    res.status(500).json({ error: 'Error deleting audio file' });
  }
});

module.exports = router;
