# Fixed Issues & New Features

## ✅ FIXED ISSUES

### 1. Get Started Button Issue
**Problem:** After login, "Get Started" button still redirected to signup
**Solution:** Now shows "Go to Dashboard" when user is logged in

### 2. Preview EPK Not Working (404 Error)
**Problem:** EPK URLs like http://localhost:3000/epk/rishav returned 404
**Root Causes:**
- EPK not published (must toggle publish in Settings)
- No EPK created for user
- Wrong slug format

**Solutions Applied:**
- Check if EPK exists in database
- Ensure EPK is published (check Settings → Publishing toggle)
- Verify correct slug (lowercase, hyphenated)

### 3. Preview Button Not Working
**Problem:** Preview button in dashboard didn't work
**Solution:** Fixed JavaScript to properly open EPK in new tab

## ✨ NEW FEATURES ADDED

### MP3/Audio Upload Functionality
- Upload MP3, WAV, M4A, AAC files (up to 50MB)
- Audio files appear in "Media" section with separate tab
- Built-in audio player in public EPK view
- Delete uploaded audio files
- Automatic file metadata tracking

## 🚀 SETUP INSTRUCTIONS

### 1. Extract Files
```bash
unzip epk-builder.zip
cd epk-builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` file:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/epk-builder
SESSION_SECRET=change-this-to-random-string
```

### 4. Create Upload Directories
```bash
mkdir -p uploads/photos
mkdir -p uploads/audio
```

### 5. Start MongoDB
**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB in Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option C - MongoDB Atlas (Cloud - Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update MONGODB_URI in .env

### 6. Start Application
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 7. Access Application
Open browser: http://localhost:3000

## 📝 STEP-BY-STEP USAGE GUIDE

### Create Your EPK

1. **Sign Up**
   - Go to http://localhost:3000/auth/signup
   - Enter: Artist Name, Email, Password, Genre
   - Click "Create Account"
   - You'll be auto-logged in and redirected to dashboard

2. **Edit Your Information**
   - Click "My EPK" in sidebar
   - Fill in: Bio, Location, Website
   - Click "Save Changes"

3. **Upload Photos**
   - Click "Media" in sidebar
   - Click "Photos" tab
   - Click "📸 Upload Photo"
   - Select image file
   - Photo will appear in gallery

4. **Upload Music (MP3)**
   - Click "Media" in sidebar
   - Click "Audio Files" tab
   - Click "🎵 Upload MP3"
   - Select audio file
   - Enter track title
   - File will upload and appear in list

5. **Add Music Links** (Spotify, YouTube, etc.)
   - Use Quick Actions → "Add Music"
   - Enter URL and title
   - Supported: Spotify, SoundCloud, YouTube, Apple Music

6. **Publish Your EPK**
   - Click "Settings" in sidebar
   - Toggle "Publishing" switch to ON
   - Status changes to "EPK is public"

7. **View Your EPK**
   - Click "👁️ Preview EPK" button at top
   - OR go to: http://localhost:3000/epk/your-artist-name
   - Share this URL with others!

## 🐛 TROUBLESHOOTING

### Issue: 404 - EPK Not Found
**Cause:** EPK not published or doesn't exist
**Solution:**
1. Login to dashboard
2. Go to Settings
3. Toggle "Publishing" ON
4. Try EPK URL again

### Issue: Can't Upload Files
**Cause:** Upload directories don't exist
**Solution:**
```bash
mkdir -p uploads/photos
mkdir -p uploads/audio
```

### Issue: MongoDB Connection Error
**Error:** `connect ECONNREFUSED 127.0.0.1:27017`
**Solution:**
1. Make sure MongoDB is running
2. Check MONGODB_URI in .env
3. For MongoDB Atlas, use full connection string

### Issue: Preview Button Does Nothing
**Solution:**
1. Make sure EPK is published (Settings → toggle ON)
2. Check browser console for errors (F12)
3. Try manually going to /epk/your-slug

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# OR change PORT in .env to 3001
```

### Issue: "Get Started" Still Shows After Login
**Solution:** Already fixed! Clear browser cache or hard refresh (Ctrl+F5)

## 📍 FINDING YOUR EPK SLUG

Your EPK slug is generated from your artist name:
- Artist Name: "Rishav" → Slug: "rishav"
- Artist Name: "The Beatles" → Slug: "the-beatles"
- Artist Name: "DJ Khaled 123" → Slug: "dj-khaled-123"

**To find your exact slug:**
1. Login to dashboard
2. Go to Settings
3. Look at "EPK URL" field
4. Your slug is the last part of the URL

## 🎵 SUPPORTED AUDIO FORMATS

**Upload (50MB max):**
- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- AAC (.aac)

**External Links (unlimited):**
- Spotify
- SoundCloud
- YouTube
- Apple Music

## 📸 SUPPORTED IMAGE FORMATS

**Upload (10MB max):**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

Images are automatically optimized to max 1200x1200px

## 🔐 DEFAULT LOGIN

After signup, use your email and password to login at:
http://localhost:3000/auth/login

## 📊 TESTING CHECKLIST

After setup, verify these work:

- [ ] Can access homepage (http://localhost:3000)
- [ ] Can sign up new account
- [ ] Can login
- [ ] Dashboard loads correctly
- [ ] Can edit EPK information
- [ ] Can upload photo
- [ ] Can upload MP3 file
- [ ] Can add music link
- [ ] Can toggle publish status
- [ ] Can view public EPK at /epk/your-slug
- [ ] Audio player works on public EPK
- [ ] Can logout

## 💡 TIPS

1. **Always publish your EPK** before sharing the URL
2. **Use descriptive filenames** for audio files (will be suggested as title)
3. **Upload high-quality photos** (they're auto-optimized)
4. **Test EPK in incognito mode** to see what others see
5. **Keep your bio under 500 words** for best readability

## 🆘 STILL HAVING ISSUES?

1. Check server logs in terminal
2. Check browser console (F12 → Console tab)
3. Verify MongoDB is running
4. Ensure all upload directories exist
5. Try deleting node_modules and running `npm install` again

## 📞 COMMON ERROR MESSAGES

**"EPK not found"** → EPK not published or wrong slug
**"Unauthorized"** → Not logged in, go to /auth/login
**"Error uploading"** → Check file size/format
**"MongoDB connection error"** → Start MongoDB or fix connection string
**"Session expired"** → Login again

---

Everything should now work perfectly! The preview feature, MP3 uploads, and all navigation issues are fixed. 🎉
