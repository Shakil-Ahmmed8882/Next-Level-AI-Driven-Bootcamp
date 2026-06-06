# DevPulse Deployment Guide

Step-by-step guide to deploy DevPulse to Vercel with NeonDB PostgreSQL.

---

## Prerequisites

- GitHub account (with DevPulse repo pushed)
- Vercel account (free at https://vercel.com)
- NeonDB account (free tier at https://neon.tech)
- Node.js 24.x installed locally

---

## Step 1: Set Up PostgreSQL Database (NeonDB)

### 1a. Create NeonDB Account

1. Go to https://neon.tech
2. Sign up with GitHub account (easiest)
3. Click "Create a project"
4. Choose:
   - **Region**: Pick closest to your location
   - **Postgres Version**: Latest (15 or 16)
5. Click "Create project"

### 1b. Get Connection String

1. In NeonDB dashboard, find your project
2. Click "Connection string"
3. Copy the connection string starting with `postgresql://`

**Format:**
```
postgresql://user:password@host/database
```

### 1c. Initialize Database Schema

1. In NeonDB dashboard, click "SQL editor"
2. Paste the contents of `src/db/init.sql`
3. Click "Run"

Database tables are now created!

---

## Step 2: Push Code to GitHub

### 2a. Create GitHub Repository

1. Go to https://github.com/new
2. Create repository name: `devpulse`
3. Make it **Public**
4. Click "Create repository"

### 2b. Push Code

```bash
cd src/all-assignments/assignment-two

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: DevPulse API"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/devpulse.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3a. Connect GitHub to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Click "Import Git Repository"
4. Search for "devpulse" and click "Import"

### 3b. Configure Project

1. **Framework Preset**: Select "Other"
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Root Directory**: `./` (leave default)

### 3c. Add Environment Variables

1. Scroll down to "Environment Variables"
2. Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste your NeonDB connection string |
| `JWT_SECRET` | Generate a random string (e.g., `your-super-secret-jwt-key-2026`) |
| `JWT_EXPIRY` | `7d` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3d. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build and deployment
3. Once complete, you'll see a preview URL

**Success URL looks like:** `https://devpulse-xxxx.vercel.app`

---

## Step 4: Verify Deployment

### Test Health Check

```bash
curl https://devpulse-xxxx.vercel.app/health
# Expected response: { "status": "OK" }
```

### Test API

```bash
# Register user
curl -X POST https://devpulse-xxxx.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Should return user object with id
```

---

## Troubleshooting

### Issue: "Build failed"

**Possible causes:**
1. TypeScript compilation error → Check `npm run build` locally
2. Missing dependencies → Run `npm install` locally
3. Environment variables not set → Double-check in Vercel dashboard

**Solution:**
```bash
# Test build locally
npm run build

# Fix any errors
git add .
git commit -m "fix: resolve build errors"
git push origin main

# Vercel will auto-redeploy
```

### Issue: "Database connection error"

**Possible causes:**
1. Wrong `DATABASE_URL` → Verify in NeonDB dashboard
2. Database not initialized → Run SQL schema in NeonDB editor

**Solution:**
1. Copy correct connection string from NeonDB
2. Update in Vercel → Settings → Environment Variables
3. Redeploy

### Issue: "Invalid JWT token"

**Possible causes:**
1. `JWT_SECRET` different on production vs local

**Solution:**
1. Set same `JWT_SECRET` in Vercel and local `.env`
2. Redeploy

---

## Alternative Deployment Options

### Using Render

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Set:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Same as Vercel
5. Deploy

### Using Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect repository
5. Add PostgreSQL plugin
6. Set environment variables
7. Deploy

---

## Production Checklist

- [ ] GitHub repo is public
- [ ] Database initialized on NeonDB
- [ ] Environment variables set in Vercel
- [ ] Build succeeds locally (`npm run build`)
- [ ] API endpoints respond with 200/201 status
- [ ] Login endpoint returns valid JWT
- [ ] Database queries execute without error
- [ ] All commits pushed to GitHub (10+)
- [ ] Live URL is publicly accessible

---

## Monitoring & Logs

### View Deployment Logs

1. In Vercel dashboard, click your project
2. Go to "Deployments"
3. Click latest deployment
4. View "Build Logs" or "Function Logs"

### Monitor Performance

1. Vercel dashboard → "Analytics"
2. View:
   - API response times
   - Error rates
   - Request frequency

---

## Rollback (If Needed)

1. In Vercel dashboard → "Deployments"
2. Find previous stable deployment
3. Click "Promote to Production"

Or push new commit with fixes:

```bash
git commit -m "fix: rollback issue"
git push origin main
# Vercel auto-redeploys
```

---

## Domain Configuration (Optional)

To use custom domain (e.g., devpulse.example.com):

1. In Vercel → Project Settings → "Domains"
2. Add your domain
3. Update DNS records at your registrar
4. Vercel provides DNS configuration details

---

## Conclusion

Your DevPulse API is now live and accessible from anywhere!

**Live URL**: `https://devpulse-xxxx.vercel.app/api`

Share this with your team and start using it! 🚀
