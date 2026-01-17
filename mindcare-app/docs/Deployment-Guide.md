# MindCare Deployment Guide

Complete instructions for deploying the MindCare mental health support app to various hosting platforms.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Local Testing](#local-testing)
3. [GitHub Pages](#github-pages-free)
4. [Netlify](#netlify-free)
5. [Vercel](#vercel-free)
6. [Cloudflare Pages](#cloudflare-pages-free)
7. [Firebase Hosting](#firebase-hosting-free-tier)
8. [Amazon S3 + CloudFront](#amazon-s3--cloudfront)
9. [Traditional Web Hosting](#traditional-web-hosting)
10. [Custom Domain Setup](#custom-domain-setup)
11. [SSL/HTTPS Configuration](#sslhttps-configuration)
12. [Performance Optimization](#performance-optimization)
13. [Monitoring & Analytics](#monitoring--analytics)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All content has been reviewed for accuracy
- [ ] Crisis hotline numbers are correct for target regions
- [ ] App has been tested on multiple browsers
- [ ] Mobile responsiveness verified
- [ ] Accessibility tested (WCAG 2.1 Level AA)
- [ ] All links work correctly
- [ ] No console errors in browser developer tools
- [ ] File size optimized (should be < 100KB)

---

## Local Testing

### Using Python (Built-in)
```bash
# Python 3
cd mindcare-app
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Open: `http://localhost:8000`

### Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server
cd mindcare-app
http-server -p 8000
```

### Using PHP
```bash
cd mindcare-app
php -S localhost:8000
```

### Using VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## GitHub Pages (Free)

**Best For:** Personal projects, portfolios, open-source apps
**Cost:** Free
**Custom Domain:** Yes (with HTTPS)
**Build Time:** ~1 minute

### Steps

1. **Create GitHub Repository**
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MindCare v1.0"

# Add remote (replace with your username)
git remote add origin https://github.com/yourusername/mindcare.git

# Push to GitHub
git branch -M main
git push -u origin main
```

2. **Enable GitHub Pages**
   - Go to repository **Settings**
   - Scroll to **Pages** section
   - Under **Source**, select branch: `main`
   - Select folder: `/ (root)`
   - Click **Save**

3. **Access Your App**
   - URL: `https://yourusername.github.io/mindcare/`
   - Usually live within 1-2 minutes

### Custom Domain with GitHub Pages
```bash
# Add CNAME file to repository
echo "mindcare.yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

Then configure DNS:
- **A Records** (for apex domain):
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **CNAME Record** (for subdomain):
  - `yourusername.github.io`

---

## Netlify (Free)

**Best For:** Quick deployments, continuous deployment
**Cost:** Free tier (100GB bandwidth/month)
**Custom Domain:** Yes (with automatic HTTPS)
**Build Time:** < 30 seconds

### Option 1: Drag & Drop (Easiest)

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up or log in
3. Drag `mindcare-app` folder onto Netlify dashboard
4. Your site is live instantly!
5. URL: `random-name-12345.netlify.app`

### Option 2: Git-Based Deployment

1. **Connect Repository**
   - Click "New site from Git"
   - Choose GitHub/GitLab/Bitbucket
   - Select your repository
   - Branch: `main`
   - Build command: (leave empty)
   - Publish directory: (leave empty or `/`)
   - Click "Deploy site"

2. **Continuous Deployment**
   - Every `git push` automatically deploys
   - Instant rollback available
   - Deploy previews for pull requests

### Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
cd mindcare-app
netlify init

# Deploy
netlify deploy --prod
```

### Custom Domain
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions
4. HTTPS automatically enabled via Let's Encrypt

---

## Vercel (Free)

**Best For:** Developers, modern projects
**Cost:** Free for personal use
**Custom Domain:** Yes (automatic HTTPS)
**Build Time:** < 20 seconds

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd mindcare-app
vercel

# Follow prompts
# Your site is live!
```

### Option 2: GitHub Integration

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Click "Deploy"
6. Done in seconds!

### Custom Domain
```bash
# Add domain via CLI
vercel domains add mindcare.yourdomain.com

# Or use dashboard:
# Settings → Domains → Add domain
```

---

## Cloudflare Pages (Free)

**Best For:** Global CDN, DDoS protection, fast loading
**Cost:** Free (unlimited bandwidth!)
**Custom Domain:** Yes
**Build Time:** ~1 minute

### Steps

1. **Create Cloudflare Account**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com/)
   - Sign up or log in

2. **Create Project**
   - Click "Create a project"
   - Connect to GitHub
   - Select repository
   - Build settings:
     - Build command: (none)
     - Build output directory: (none)
   - Click "Save and Deploy"

3. **Access App**
   - URL: `mindcare-abc.pages.dev`
   - Custom domain available

### Benefits
- Cloudflare's global CDN (200+ locations)
- Automatic DDoS protection
- Built-in analytics
- Unlimited bandwidth

---

## Firebase Hosting (Free Tier)

**Best For:** Google ecosystem integration, future scalability
**Cost:** Free tier (10GB storage, 360MB/day bandwidth)
**Custom Domain:** Yes
**Build Time:** ~1 minute

### Steps

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Initialize Project**
```bash
cd mindcare-app
firebase init hosting

# Answer prompts:
# - Create new project or use existing
# - Public directory: . (current directory)
# - Single-page app: Yes
# - Overwrite index.html: No
```

4. **Deploy**
```bash
firebase deploy
```

5. **Access App**
   - URL: `your-project.web.app`
   - Or: `your-project.firebaseapp.com`

### Custom Domain
```bash
# Add domain
firebase hosting:channel:deploy mindcare --domain mindcare.yourdomain.com
```

---

## Amazon S3 + CloudFront

**Best For:** Enterprise, high-traffic applications
**Cost:** Pay-as-you-go (very cheap for static sites)
**Custom Domain:** Yes
**Build Time:** 5-10 minutes (first time)

### Steps

1. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Click "Create bucket"
   - Name: `mindcare-app` (must be unique)
   - Region: Choose closest to users
   - Uncheck "Block all public access"
   - Click "Create bucket"

2. **Upload Files**
   - Select bucket
   - Click "Upload"
   - Add `index.html` and all assets
   - Click "Upload"

3. **Enable Static Website Hosting**
   - Bucket → Properties → Static website hosting
   - Select "Enable"
   - Index document: `index.html`
   - Error document: `index.html`
   - Save changes

4. **Set Bucket Policy**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mindcare-app/*"
    }
  ]
}
```

5. **Create CloudFront Distribution** (CDN)
   - Go to CloudFront Console
   - Click "Create distribution"
   - Origin domain: Select your S3 bucket
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Default root object: `index.html`
   - Create distribution

6. **Access App**
   - CloudFront URL: `d123abc456.cloudfront.net`
   - S3 URL: `mindcare-app.s3-website-us-east-1.amazonaws.com`

---

## Traditional Web Hosting

**Best For:** Existing hosting plans, cPanel users
**Cost:** Varies ($5-20/month typical)
**Custom Domain:** Usually included
**Build Time:** Instant (FTP upload)

### Via FTP/SFTP

1. **Get FTP Credentials**
   - From your hosting provider
   - Hostname, username, password, port

2. **Upload Files**
   - Use FileZilla, Cyberduck, or built-in FTP client
   - Connect to your server
   - Navigate to `public_html` or `www` directory
   - Upload all files from `mindcare-app` folder

3. **Access App**
   - URL: `yourdomain.com` or `yourdomain.com/mindcare`

### Via cPanel File Manager

1. Log in to cPanel
2. Open "File Manager"
3. Navigate to `public_html`
4. Click "Upload"
5. Select `index.html`
6. Done!

---

## Custom Domain Setup

### DNS Configuration

**For Apex Domain (example.com):**
```
Type: A
Host: @
Value: [Your hosting IP]
TTL: 3600
```

**For Subdomain (mindcare.example.com):**
```
Type: CNAME
Host: mindcare
Value: [Your hosting URL]
TTL: 3600
```

### Popular DNS Providers
- **Cloudflare:** Best for performance, free DDoS protection
- **Google Domains:** Simple, reliable
- **Namecheap:** Popular, affordable
- **Route 53 (AWS):** Enterprise-grade

### Propagation Time
- DNS changes take 1-48 hours to propagate globally
- Use [dnschecker.org](https://dnschecker.org) to monitor
- Clear browser cache to see changes faster

---

## SSL/HTTPS Configuration

### Automatic HTTPS (Recommended)

**All these platforms provide automatic HTTPS:**
- GitHub Pages (via Let's Encrypt)
- Netlify (via Let's Encrypt)
- Vercel (via Let's Encrypt)
- Cloudflare Pages (via Cloudflare)
- Firebase Hosting (included)

### Manual SSL (Traditional Hosting)

1. **Get SSL Certificate**
   - **Let's Encrypt (Free):** Use Certbot
   - **Paid Options:** GoDaddy, Namecheap, DigiCert

2. **Install Certificate**
   - Via cPanel: SSL/TLS section
   - Via CLI: Depends on web server (Apache/Nginx)

3. **Force HTTPS**

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Nginx (config file):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Performance Optimization

### Pre-Deployment

1. **Minify** (if separating files later)
   - CSS: `cssnano`, `clean-css`
   - JavaScript: `terser`, `uglify-js`
   - HTML: `html-minifier`

2. **Enable Compression**
   - Gzip (most servers enable by default)
   - Brotli (better compression, newer)

### Post-Deployment

1. **Enable Caching**

**Apache (.htaccess):**
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType image/png "access plus 1 year"
</IfModule>
```

2. **CDN Configuration**
   - Use Cloudflare (free tier available)
   - Or platform-specific CDN (Netlify, Vercel include CDN)

3. **Image Optimization** (future)
   - Use WebP format
   - Lazy loading for images
   - Responsive images with srcset

---

## Monitoring & Analytics

### Privacy-Respecting Analytics

**Plausible (Recommended)**
- Privacy-friendly
- GDPR compliant
- No cookies
- Lightweight (< 1KB)

```html
<!-- Add to index.html before </head> -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

**Simple Analytics**
- Similar to Plausible
- Privacy-first
- No cookies

**Fathom**
- Privacy-focused
- GDPR compliant
- Beautiful dashboard

### Uptime Monitoring

**UptimeRobot (Free)**
- Checks site every 5 minutes
- Email/SMS alerts
- Status page

**Pingdom**
- Real user monitoring
- Performance insights
- Free tier available

### Error Tracking

**Sentry**
```javascript
// Add to your JavaScript
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

---

## Deployment Checklist

- [ ] App tested locally
- [ ] All crisis resources verified
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] DNS propagated
- [ ] Caching configured
- [ ] Compression enabled
- [ ] Analytics installed (optional, privacy-respecting only)
- [ ] Uptime monitoring set up
- [ ] Backup strategy in place

---

## Rollback Procedures

### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push
```

### Netlify
- Dashboard → Deploys → Click previous deploy → "Publish deploy"

### Vercel
- Dashboard → Deployments → Click previous → "Promote to production"

### Firebase
```bash
firebase hosting:rollback
```

---

## Troubleshooting

### Site Not Loading

1. **Check DNS**
   - Use `nslookup yourdomain.com`
   - Verify A/CNAME records

2. **Clear Cache**
   - Browser: Ctrl+Shift+R (or Cmd+Shift+R)
   - CDN: Purge cache in dashboard

3. **Check Deployment Status**
   - Most platforms have status pages
   - Check deploy logs for errors

### HTTPS Issues

1. **Mixed Content Error**
   - Ensure all resources use HTTPS
   - Check browser console for warnings

2. **Certificate Not Trusted**
   - Wait for propagation (up to 24 hours)
   - Clear browser cache

### Performance Issues

1. **Run Lighthouse Audit**
   - Chrome DevTools → Lighthouse
   - Score should be 90+ for all categories

2. **Check Network Tab**
   - Identify slow-loading resources
   - Optimize large files

---

## Support

If you encounter issues during deployment:

1. Check platform-specific documentation
2. Search GitHub Issues
3. Ask in community forums
4. Contact platform support

---

## Security Considerations

### Content Security Policy (CSP)

Add meta tag to `index.html`:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';">
```

### X-Frame-Options

Prevent clickjacking:
```apache
# .htaccess
Header always set X-Frame-Options "SAMEORIGIN"
```

### Permissions Policy

```html
<meta http-equiv="Permissions-Policy"
      content="geolocation=(), microphone=(), camera=()">
```

---

## Conclusion

MindCare is designed to be deployment-friendly. Choose the platform that best fits your needs:

- **Quickest:** Netlify (drag & drop)
- **Most Features:** Vercel
- **Best Free Tier:** Cloudflare Pages (unlimited bandwidth)
- **Enterprise:** AWS S3 + CloudFront
- **Open Source Standard:** GitHub Pages

All options provide excellent performance and HTTPS out of the box!

---

**Last Updated:** January 15, 2026
**Version:** 1.0.0
