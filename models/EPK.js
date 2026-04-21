const mongoose = require('mongoose');

const epkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  artistName: {
    type: String,
    required: true
  },
  genre: String,
  bio: {
    type: String,
    maxlength: 5000
  },
  location: String,
  website: String,
  socialLinks: {
    spotify: String,
    instagram: String,
    facebook: String,
    twitter: String,
    youtube: String,
    soundcloud: String,
    tiktok: String
  },
  photos: [{
    url: String,
    caption: String,
    isProfile: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  music: [{
    platform: { type: String, enum: ['spotify', 'soundcloud', 'youtube', 'apple', 'upload'] },
    url: String,
    title: String,
    description: String,
    embedCode: String,
    filePath: String, // For uploaded MP3 files
    fileSize: Number, // File size in bytes
    duration: Number, // Duration in seconds
    addedAt: { type: Date, default: Date.now }
  }],
  videos: [{
    platform: { type: String, enum: ['youtube', 'vimeo'] },
    url: String,
    title: String,
    embedId: String,
    addedAt: { type: Date, default: Date.now }
  }],
  press: [{
    title: String,
    publication: String,
    url: String,
    date: Date,
    quote: String
  }],
  shows: [{
    venue: String,
    city: String,
    date: Date,
    ticketUrl: String,
    isUpcoming: { type: Boolean, default: true }
  }],
  template: {
    type: String,
    default: 'electric-dreams'
  },
  customColors: {
    primary: { type: String, default: '#667eea' },
    secondary: { type: String, default: '#764ba2' },
    accent: { type: String, default: '#ff6b6b' }
  },
  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  lastViewedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
epkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from artist name
epkSchema.statics.generateSlug = async function(artistName) {
  const baseSlug = artistName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  while (await this.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

module.exports = mongoose.model('EPK', epkSchema);
