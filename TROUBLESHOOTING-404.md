# 🔴 FIXING 404 ERROR - Step by Step Guide

## Your Situation
You've uploaded audio, filled in your EPK info, but clicking "Preview EPK" shows a 404 error.

## ✅ SOLUTION (Follow These Steps IN ORDER)

### Step 1: Check if Your EPK is Published

1. **Go to Dashboard** → Click **"Settings"** in the sidebar
2. Look for the **"Publishing Status"** card (it has a purple border)
3. **Toggle the switch to ON** (it should turn purple/blue)
4. You should see: **"EPK is public ✓"** in green text
5. A notification will appear: **"EPK is now public! Share your link."**

### Step 2: Verify Your EPK URL

In Settings, look at the **"EPK URL"** field. Your URL should be:
```
http://localhost:3000/epk/rishav
```

The slug (last part) is based on your artist name "Rishav".

### Step 3: Test Your EPK

**Option A:** Click the **"👁️ Preview EPK"** button at the top of dashboard

**Option B:** Manually visit: `http://localhost:3000/epk/rishav`

### Step 4: If Still Getting 404

Run this diagnostic URL in your browser:
```
http://localhost:3000/debug/epk-status
```

This will show you:
- If your EPK exists
- If it's published
- Your actual slug
- Content counts

## 🎯 Common Issues & Fixes

### Issue 1: "EPK is private" in Settings
**Fix:** Toggle the Publishing switch to ON

### Issue 2: Different slug than expected
**Fix:** Check the debug URL above to see your actual slug

### Issue 3: EPK doesn't exist in database
**Fix:** 
1. Logout
2. Login again
3. Check if EPK was created during signup
4. If not, contact support or recreate account

### Issue 4: MongoDB not running
**Symptoms:** Can't save changes, can't login
**Fix:**
```bash
# Check if MongoDB is running
mongod

# Or start MongoDB service
sudo service mongod start
```

## 📝 Checklist Before Sharing EPK

- [ ] EPK is published (Settings → Publishing → Toggle ON)
- [ ] Bio is filled in
- [ ] At least one photo uploaded
- [ ] At least one audio track uploaded
- [ ] Tested EPK URL works (shows your page, not 404)
- [ ] Social links added (optional but recommended)

## 🔍 Detailed Diagnosis Steps

### Method 1: Browser Console Check

1. Open your browser's Developer Tools (F12)
2. Go to **Console** tab
3. Click "Preview EPK"
4. Look for any red error messages
5. Share those errors if you need help

### Method 2: Server Log Check

In your terminal where you ran `npm start`, look for:
- **Good:** `✅ MongoDB connected successfully`
- **Bad:** `❌ MongoDB connection error`

### Method 3: Database Check

If you have MongoDB installed:
```bash
mongo
use epk-builder
db.epks.find({ slug: "rishav" })
```

This shows if your EPK exists in the database.

## 🎬 Complete Workflow (From Fresh Start)

1. **Signup:** Create account with artist name "Rishav"
2. **Login:** Use your email and password
3. **Dashboard loads:** You should see "Welcome back, Rishav!"
4. **Edit EPK:**
   - Click "My EPK"
   - Fill in bio, location, website
   - Click "Save Changes"
5. **Upload Media:**
   - Click "Media"
   - Upload photos (Photos tab)
   - Upload MP3 (Audio Files tab)
6. **PUBLISH (CRUCIAL STEP):**
   - Click "Settings"
   - Find "Publishing Status" card
   - Toggle switch to ON
   - See "EPK is public ✓"
7. **Preview:**
   - Click "👁️ Preview EPK" button
   - Your EPK should load!

## ⚠️ MOST COMMON MISTAKE

**95% of 404 errors happen because EPK is not published!**

The EPK exists, has content, but the `published` field in database is `false`.

**Quick Fix:**
1. Settings
2. Toggle Publishing ON
3. Done!

## 🆘 Still Not Working?

### Check these URLs:

1. **Homepage:** http://localhost:3000 (should work)
2. **Login:** http://localhost:3000/auth/login (should work)
3. **Dashboard:** http://localhost:3000/dashboard (should work after login)
4. **Debug:** http://localhost:3000/debug/epk-status (shows EPK status)
5. **EPK:** http://localhost:3000/epk/rishav (works ONLY if published)

### Terminal Output

When you click Preview EPK, you should see in terminal:
```
GET /epk/rishav 200
```

If you see:
```
GET /epk/rishav 404
```

Then EPK is either:
- Not published (most likely!)
- Doesn't exist
- Has different slug

## 📞 Getting Help

If still stuck, check:

1. **MongoDB Status:**
   ```bash
   systemctl status mongod
   # or
   ps aux | grep mongod
   ```

2. **NPM Dependencies:**
   ```bash
   npm install
   ```

3. **Environment:**
   ```bash
   cat .env
   # Check MONGODB_URI is correct
   ```

4. **Restart Everything:**
   ```bash
   # Stop server (Ctrl+C)
   # Restart MongoDB
   mongod
   # In new terminal
   npm start
   ```

## 💡 Pro Tips

1. **Always publish before sharing** - Unpublished EPKs return 404
2. **Check Settings first** - Most issues are just "not published"
3. **Use debug URL** - http://localhost:3000/debug/epk-status is your friend
4. **Test in incognito** - See what others see (logged out view)

## ✅ Success Indicators

You'll know it's working when:
- Preview EPK opens in new tab
- Shows your artist name at the top
- Shows your uploaded audio with player
- Shows your photos
- No 404 error!

---

**TL;DR: Go to Settings → Toggle Publishing to ON → Click Preview → Should work! 🎉**
