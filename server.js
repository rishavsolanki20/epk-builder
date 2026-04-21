const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/epk-builder';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const epkRoutes = require('./routes/epk');
const uploadRoutes = require('./routes/upload');
const apiRoutes = require('./routes/api');

app.use('/auth', authRoutes);
app.use('/epk', epkRoutes);
app.use('/upload', uploadRoutes);
app.use('/api/epk', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('dashboard', { user: req.session.user });
});

// Debug route to check EPK status
app.get('/debug/epk-status', async (req, res) => {
  if (!req.session.user) {
    return res.json({ error: 'Not logged in' });
  }
  
  try {
    const User = require('./models/User');
    const EPK = require('./models/EPK');
    
    const user = await User.findById(req.session.user.id).populate('epks');
    
    if (!user || !user.epks || user.epks.length === 0) {
      return res.json({ 
        status: 'NO_EPK',
        message: 'No EPK found for this user',
        user: req.session.user
      });
    }
    
    const epk = user.epks[0];
    
    res.json({
      status: 'OK',
      epk: {
        slug: epk.slug,
        published: epk.published,
        artistName: epk.artistName,
        url: `/epk/${epk.slug}`,
        musicCount: epk.music?.length || 0,
        photosCount: epk.photos?.length || 0,
        hasContent: !!(epk.bio || epk.music?.length || epk.photos?.length)
      }
    });
  } catch (error) {
    res.json({ 
      status: 'ERROR',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
