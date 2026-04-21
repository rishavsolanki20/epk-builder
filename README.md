# SoundKit - EPK Builder for Musicians

A fully functional Electronic Press Kit (EPK) builder that allows musicians to create professional online press kits with music, photos, videos, press coverage, and more.

## Features

### ✅ Implemented Features

**User Management:**
- User registration and authentication
- Secure password hashing with bcrypt
- Session-based authentication
- 14-day free trial system

**EPK Management:**
- Create and edit EPK profiles
- Custom slug generation (yoursite.com/epk/artist-name)
- Bio, genre, location, website fields
- Social media links (Spotify, Instagram, Facebook, etc.)
- Publish/unpublish EPK
- View tracking and analytics

**Media Management:**
- Photo upload with automatic optimization
- Image resizing with Sharp
- Photo gallery management
- Profile photo designation

**Music Integration:**
- Add tracks from Spotify, SoundCloud, YouTube
- Embed music players
- Track listing management

**Dashboard:**
- Statistics overview (views, photos, tracks)
- Quick actions for common tasks
- Media library
- Settings management
- Analytics section (framework ready)

**Technical Features:**
- MongoDB database with Mongoose ODM
- Express.js backend
- EJS templating
- RESTful API design
- File upload handling with Multer
- Image optimization with Sharp
- Responsive design
- Session management

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or extract the project:**
```bash
cd epk-builder
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/epk-builder
SESSION_SECRET=your-super-secret-session-key-change-this
```

4. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# If using MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Start the application:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

6. **Access the application:**
Open your browser and navigate to: `http://localhost:3000`

## Project Structure

```
epk-builder/
├── config/              # Configuration files
├── models/              # Mongoose models
│   ├── User.js         # User schema
│   └── EPK.js          # EPK schema
├── routes/              # Express routes
│   ├── auth.js         # Authentication routes
│   ├── epk.js          # EPK management routes
│   └── upload.js       # File upload routes
├── views/               # EJS templates
│   ├── index.ejs       # Landing page
│   ├── dashboard.ejs   # User dashboard
│   └── auth/           # Auth pages
├── public/              # Static assets
│   ├── css/            # Stylesheets
│   └── js/             # Client-side JavaScript
├── uploads/             # User uploads
│   └── photos/         # Photo uploads
├── server.js           # Main application file
└── package.json        # Dependencies
```

## API Endpoints

### Authentication
- `GET /auth/signup` - Signup page
- `POST /auth/signup` - Create new account
- `GET /auth/login` - Login page
- `POST /auth/login` - Authenticate user
- `GET /auth/logout` - Logout user

### EPK Management
- `GET /epk/:slug` - View public EPK
- `GET /epk/:slug/edit` - Edit EPK (authenticated)
- `POST /epk/:slug/update` - Update EPK data
- `POST /epk/:slug/publish` - Toggle publish status
- `POST /epk/:slug/music` - Add music track
- `POST /epk/:slug/videos` - Add video
- `POST /epk/:slug/press` - Add press coverage
- `DELETE /epk/:slug/:collection/:itemId` - Delete item

### Upload
- `POST /upload/photo/:slug` - Upload photo
- `DELETE /upload/photo/:slug/:photoId` - Delete photo

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  artistName: String (required),
  genre: String,
  plan: String (enum: 'free', 'pro', 'premium'),
  trialEndsAt: Date,
  createdAt: Date,
  epks: [ObjectId] (ref: EPK)
}
```

### EPK Model
```javascript
{
  user: ObjectId (ref: User),
  slug: String (unique, required),
  artistName: String (required),
  genre: String,
  bio: String,
  location: String,
  website: String,
  socialLinks: {
    spotify, instagram, facebook, twitter,
    youtube, soundcloud, tiktok: String
  },
  photos: [{
    url, caption: String,
    isProfile: Boolean,
    uploadedAt: Date
  }],
  music: [{
    platform, url, title, description, embedCode: String,
    addedAt: Date
  }],
  videos: [{
    platform, url, title, embedId: String,
    addedAt: Date
  }],
  press: [{
    title, publication, url: String,
    date: Date,
    quote: String
  }],
  shows: [{
    venue, city: String,
    date: Date,
    ticketUrl: String,
    isUpcoming: Boolean
  }],
  template: String,
  customColors: {
    primary, secondary, accent: String
  },
  published: Boolean,
  views: Number,
  lastViewedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### Creating an Account
1. Navigate to `/auth/signup`
2. Fill in email, password, artist name, and genre
3. Submit the form
4. You'll be redirected to the dashboard with a default EPK created

### Editing Your EPK
1. Login to your account
2. Navigate to the dashboard
3. Click on "My EPK" in the sidebar
4. Edit your information
5. Click "Save Changes"

### Uploading Photos
1. Go to "Media" section
2. Click "Upload Photo"
3. Select an image file
4. Photo will be automatically optimized and added to your gallery

### Publishing Your EPK
1. Go to "Settings" section
2. Toggle the "Publish" switch
3. Your EPK will be publicly accessible at `/epk/your-slug`

## Next Steps for Production

### Security Enhancements
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Add email verification
- [ ] Set up password reset flow
- [ ] Add input sanitization
- [ ] Implement content security policy

### Features to Add
- [ ] Template selection and customization
- [ ] Advanced analytics (charts, graphs)
- [ ] Export EPK as PDF
- [ ] Email EPK to contacts
- [ ] Upcoming shows calendar
- [ ] Integration with streaming platforms API
- [ ] Custom domain support
- [ ] Payment integration for premium plans
- [ ] Email notifications
- [ ] Collaboration features

### Performance Optimizations
- [ ] Add Redis for session storage
- [ ] Implement CDN for static assets
- [ ] Add database indexing
- [ ] Implement caching strategy
- [ ] Optimize image delivery
- [ ] Add lazy loading for media

### DevOps
- [ ] Set up CI/CD pipeline
- [ ] Add Docker containerization
- [ ] Set up monitoring (Datadog, New Relic)
- [ ] Configure backup strategy
- [ ] Add error tracking (Sentry)
- [ ] Set up logging system

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** bcryptjs, express-session
- **File Upload:** Multer, Sharp
- **Templating:** EJS
- **Validation:** express-validator
- **Frontend:** Vanilla JavaScript, CSS3

## Contributing

This is a functional prototype. To add features:
1. Create a new branch
2. Implement your feature
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this for your own projects!

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ for musicians everywhere.
