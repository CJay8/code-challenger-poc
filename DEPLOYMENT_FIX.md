# 🔧 Deployment Configuration Fix

## Issues Found

1. **Render Error**: Root directory configuration mismatch
2. **Vercel Error**: Build command not finding dependencies

## ✅ Fixed Configurations

I've updated both `vercel.json` and `render.yaml`. Now follow these exact steps:

---

## 🎯 RENDER DEPLOYMENT (Backend)

### Option 1: Using render.yaml (Recommended)

1. **Delete your existing Render service** if you created one
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **"New +"** → **"Blueprint"**
4. Connect your repository: `CJay8/code-challenger-poc`
5. Render will automatically detect `render.yaml` and configure everything
6. Add environment variable:
   ```
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
7. Click **"Apply"**

### Option 2: Manual Configuration

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Select repository: `CJay8/code-challenger-poc`
4. **Configure EXACTLY as follows**:
   ```
   Name: code-challenge-backend
   Region: Oregon (US West)
   Branch: main (or master)
   Root Directory: backend        ⚠️ IMPORTANT: Type "backend" here
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
6. Click **"Create Web Service"**

**Note**: When you set Root Directory to `backend`, the build commands run FROM that directory, so don't use `cd backend`.

---

## 🎯 VERCEL DEPLOYMENT (Frontend)

1. **Delete your existing Vercel project** if you created one
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **"Add New..."** → **"Project"**
4. Select repository: `CJay8/code-challenger-poc`
5. **Configure EXACTLY as follows**:
   ```
   Framework Preset: Vite
   Root Directory: frontend       ⚠️ IMPORTANT: Click "Edit" and type "frontend"
   Build Command: npm run build   (default is fine)
   Output Directory: dist         (default is fine)
   Install Command: npm install   (default is fine)
   ```
6. Add environment variables:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   VITE_WS_URL=wss://your-render-backend.onrender.com
   ```
   Replace with your actual Render URL
7. Click **"Deploy"**

---

## 🔄 After Both Deployments

1. **Copy your Render backend URL** (e.g., `https://code-challenge-backend.onrender.com`)
2. **Update Vercel environment variables**:
   - Go to Vercel project → Settings → Environment Variables
   - Update `VITE_API_URL` and `VITE_WS_URL` with your Render URL
   - Redeploy if needed

3. **Copy your Vercel frontend URL** (e.g., `https://code-challenger-poc.vercel.app`)
4. **Update Render environment variables**:
   - Go to Render service → Environment
   - Update `CORS_ORIGIN` with your Vercel URL
   - Service will auto-redeploy

---

## 📋 Quick Reference

### Render Settings
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

### Vercel Settings
```
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

---

## ✅ Verification

After deployment, test:

1. **Backend Health Check**: 
   ```
   https://your-backend.onrender.com/api/health
   ```
   Should return: `{ "status": "ok" }`

2. **Frontend**:
   - Visit your Vercel URL
   - Open browser console (F12)
   - Check for CORS errors
   - Test all three problems

---

## 🐛 Still Having Issues?

### Render: "Root directory does not exist"
- ✅ Make sure you typed `backend` (lowercase, no slash)
- ✅ Don't use `cd backend` in build command
- ✅ Branch should be `main` or `master` (check your GitHub default branch)

### Vercel: "vite: command not found"
- ✅ Make sure Root Directory is set to `frontend`
- ✅ Build Command should be `npm run build` (not `vite build`)
- ✅ Install Command should be `npm install`

### CORS Errors
- ✅ Backend `CORS_ORIGIN` must match your Vercel URL exactly
- ✅ Frontend `VITE_API_URL` must match your Render URL exactly
- ✅ Use `https://` for API URL and `wss://` for WebSocket URL

---

## 💾 Files Updated

- ✅ `vercel.json` - Simplified (no build commands)
- ✅ `render.yaml` - Added `rootDir: backend`
- ✅ This guide: `DEPLOYMENT_FIX.md`

Now push these changes and redeploy! 🚀
