# 🚀 Deployment Guide

This guide will walk you through deploying your application to Vercel (frontend) and Render (backend).

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (connected to GitHub)
- ✅ Render account (connected to GitHub)
- ✅ Code pushed to GitHub repository

## 📦 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial deployment"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/code-challenge-solution.git

# Push to GitHub
git push -u origin master
```

### Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select your GitHub repository: `code-challenge-solution`
   - Click "Connect"

3. **Configure Service**
   ```
   Name: code-challenge-backend
   Region: Oregon (US West)
   Branch: master
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add the following:
     ```
     NODE_ENV=production
     PORT=10000
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```
   - ⚠️ Note: You'll update `CORS_ORIGIN` after deploying frontend

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait for build and deployment (5-10 minutes)
   - Copy your backend URL: `https://code-challenge-backend.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select your GitHub repository: `code-challenge-solution`
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     ```
     VITE_API_URL=https://code-challenge-backend.onrender.com
     VITE_WS_URL=wss://code-challenge-backend.onrender.com
     ```
   - Replace with your actual Render backend URL from Step 2

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Your app is live! 🎉

### Step 4: Update Backend CORS

1. **Go back to Render Dashboard**
   - Select your backend service
   - Go to "Environment" tab

2. **Update CORS_ORIGIN**
   - Edit `CORS_ORIGIN` variable
   - Set it to your Vercel URL: `https://your-app.vercel.app`
   - Click "Save Changes"

3. **Redeploy**
   - Render will automatically redeploy with new settings

## 🔄 Continuous Deployment

Both Vercel and Render are now set up for continuous deployment:

- **Every push to `master`** triggers automatic deployment
- **Pull requests** get preview deployments (Vercel only)
- **Environment variables** persist across deployments

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Frontend loads at Vercel URL
- [ ] Backend health check works: `https://your-backend.onrender.com/api/health`
- [ ] Problem 1 (Math Lab) loads and calculations work
- [ ] Problem 2 (Currency Swap) connects to WebSocket
- [ ] Problem 3 (Code Auditor) displays code and issues
- [ ] No CORS errors in browser console
- [ ] All interactive features work

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: "Failed to fetch" or CORS errors
- **Solution**: Check that `VITE_API_URL` in Vercel matches your Render backend URL
- **Solution**: Ensure backend `CORS_ORIGIN` includes your Vercel frontend URL

**Problem**: 404 on page refresh
- **Solution**: Vercel should handle this automatically with `vercel.json`

### Backend Issues

**Problem**: Backend not responding
- **Solution**: Check Render logs for errors
- **Solution**: Verify `PORT` is set to `10000` (Render default)

**Problem**: WebSocket connection fails
- **Solution**: Ensure `VITE_WS_URL` uses `wss://` (not `ws://`)
- **Solution**: Check Render service is running

### Common Issues

**Problem**: Environment variables not updating
- **Solution**: Redeploy after changing environment variables
- **Solution**: Check variable names match exactly (case-sensitive)

**Problem**: Build fails
- **Solution**: Check build logs for specific errors
- **Solution**: Ensure all dependencies are in `package.json`
- **Solution**: Verify Node version compatibility (>=18.0.0)

## 📊 Monitoring

### Vercel Analytics
- Go to your project → "Analytics" tab
- Monitor page views, performance, and errors

### Render Metrics
- Go to your service → "Metrics" tab
- Monitor CPU, memory, and request counts

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Keep environment variables in platform dashboards** - Not in code
3. **Use HTTPS/WSS** - Always use secure protocols in production
4. **Review CORS settings** - Only allow your frontend domain
5. **Monitor logs** - Check for suspicious activity

## 🎯 Next Steps

- ✅ Set up custom domain on Vercel
- ✅ Enable Vercel Analytics
- ✅ Set up error tracking (e.g., Sentry)
- ✅ Configure CDN caching
- ✅ Add database if needed
- ✅ Set up monitoring alerts

## 💡 Tips

- **Free Tier Limitations**:
  - Render free tier: 750 hours/month, spins down after 15 min inactivity
  - Vercel free tier: 100 GB bandwidth, unlimited deployments
  
- **Cold Starts**:
  - First request to Render after inactivity may take 30-60 seconds
  - Consider upgrading to paid plan for always-on service

- **Logs**:
  - Vercel: Check "Deployments" → Select deployment → "Logs"
  - Render: Check "Logs" tab in your service dashboard

## 📞 Support

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Render**: [render.com/docs](https://render.com/docs)

---

**Happy Deploying! 🚀**
