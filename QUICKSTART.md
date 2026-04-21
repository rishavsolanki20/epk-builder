# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)

## Option 1: Automated Installation (Linux/Mac)

```bash
chmod +x install.sh
./install.sh
```

Then:
```bash
npm start
```

## Option 2: Manual Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
- `SESSION_SECRET` - A random string for session encryption
- `MONGODB_URI` - Your MongoDB connection string

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**MongoDB Atlas:**
Use the connection string from your Atlas dashboard

### 4. Create Upload Directories
```bash
mkdir -p uploads/photos
```

### 5. Start the Application

**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 6. Access the Application
Open your browser to: http://localhost:3000

## First Steps

1. **Sign Up**: Go to http://localhost:3000/auth/signup
2. **Create Account**: Enter your artist name, email, and password
3. **Dashboard**: You'll be redirected to the dashboard
4. **Edit EPK**: Click "My EPK" to add your bio, music, photos
5. **Publish**: Toggle publish in Settings to make your EPK public
6. **Share**: Copy your EPK URL and share it!

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running (`mongod` command)

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change PORT in .env file or kill the process using port 3000

### File Upload Error
```
Error: ENOENT: no such file or directory
```
**Solution**: Create upload directories: `mkdir -p uploads/photos`

## Default Configuration

- **Port**: 3000
- **Database**: mongodb://localhost:27017/epk-builder
- **Max File Size**: 10MB
- **Trial Period**: 14 days

## Testing

After installation, test these features:

✅ Create account
✅ Login
✅ Edit EPK information
✅ Upload photo
✅ Add music link
✅ Publish EPK
✅ View public EPK
✅ View analytics

## Need Help?

- Check README.md for detailed documentation
- Review the API endpoints section
- Check server logs for error messages

## Production Deployment

For production:
1. Set `NODE_ENV=production` in .env
2. Use a strong `SESSION_SECRET`
3. Use MongoDB Atlas or a managed database
4. Set up SSL/HTTPS
5. Configure a reverse proxy (nginx)
6. Set up monitoring and logging
7. Enable rate limiting
8. Implement backup strategy

Enjoy building amazing EPKs! 🎵
