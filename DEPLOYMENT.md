# Deployment Guide

## Overview
This guide covers deploying SoundKit EPK Builder to production environments.

## Deployment Options

### 1. Heroku (Easiest)

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create your-epk-builder
```

4. **Add MongoDB Atlas**
```bash
# Sign up for MongoDB Atlas: https://www.mongodb.com/cloud/atlas
# Create a cluster and get your connection string
heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
```

5. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET="your-random-secret-key-here"
```

6. **Deploy**
```bash
git add .
git commit -m "Ready for deployment"
git push heroku main
```

7. **Open Your App**
```bash
heroku open
```

### 2. DigitalOcean App Platform

#### Steps

1. **Create Account**
   - Sign up at https://www.digitalocean.com

2. **Create App**
   - Go to App Platform
   - Connect your GitHub repository
   - Select the branch to deploy

3. **Configure Environment**
   - Add environment variables in the console
   - Set up MongoDB (use managed database or Atlas)

4. **Deploy**
   - Click "Deploy"

### 3. AWS (Advanced)

#### Services Needed
- EC2 instance
- MongoDB Atlas or DocumentDB
- S3 for file storage
- CloudFront for CDN
- Route 53 for DNS

#### Basic Setup

1. **Launch EC2 Instance**
```bash
# Connect to your instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

2. **Clone Repository**
```bash
git clone your-repo-url
cd epk-builder
npm install --production
```

3. **Configure Environment**
```bash
nano .env
# Add your production environment variables
```

4. **Start with PM2**
```bash
pm2 start server.js --name epk-builder
pm2 startup
pm2 save
```

5. **Configure Nginx**
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/epk-builder

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /path/to/epk-builder/uploads;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/epk-builder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Pre-Deployment Checklist

### Security
- [ ] Change SESSION_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs
- [ ] Set secure cookie flags

### Database
- [ ] Use MongoDB Atlas or managed database
- [ ] Set up database backups
- [ ] Configure indexes for performance
- [ ] Enable authentication
- [ ] Restrict network access

### File Storage
- [ ] Consider using S3 or similar for uploads
- [ ] Set up CDN for static assets
- [ ] Configure proper file permissions
- [ ] Implement file size limits
- [ ] Enable virus scanning for uploads

### Monitoring
- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure logging (Winston, Papertrail)
- [ ] Monitor server health (Datadog, New Relic)
- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)
- [ ] Configure alerts

### Performance
- [ ] Enable gzip compression
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Use CDN for static assets
- [ ] Implement lazy loading
- [ ] Minimize bundle sizes

## Environment Variables for Production

```bash
# Server
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/epk-builder

# Session
SESSION_SECRET=your-very-long-random-secret-key

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/www/uploads

# Email (for future features)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1

# Application
APP_URL=https://yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
```

## Post-Deployment

1. **Test All Features**
   - User registration
   - Login/logout
   - EPK creation and editing
   - File uploads
   - Public EPK viewing
   - All API endpoints

2. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Watch database connections
   - Check memory usage

3. **Set Up Backups**
   - Database backups (daily)
   - File storage backups
   - Configuration backups

4. **Documentation**
   - Document deployment process
   - Create runbook for common issues
   - Set up team access

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ALB, nginx)
- Deploy multiple app instances
- Session storage in Redis
- Shared file storage (S3)

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for read-heavy workloads
- Sharding for large datasets

### Caching
- Redis for session storage
- CloudFront/CloudFlare for CDN
- Application-level caching

## Common Issues

### Issue: MongoDB Connection Timeout
**Solution**: Check network security groups, whitelist IP addresses

### Issue: File Upload Fails
**Solution**: Check permissions on upload directory, verify MAX_FILE_SIZE

### Issue: Session Lost on Restart
**Solution**: Use Redis for session storage instead of memory

### Issue: High Memory Usage
**Solution**: Implement streaming for large files, optimize image processing

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review error logs weekly
- Monitor disk space
- Check SSL certificate expiration
- Review user feedback

### Backups
- Automated daily database backups
- Test restore process quarterly
- Keep 30 days of backups

## Support

For deployment issues:
1. Check application logs
2. Review Nginx/Apache logs
3. Check database connectivity
4. Verify environment variables
5. Contact support team

---

Good luck with your deployment! 🚀
