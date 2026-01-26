# Backend API Configuration Refactoring

## Overview

This refactoring centralizes all backend API URL configuration into a single location, removing hardcoded URLs throughout the codebase. This enables seamless deployment across different environments (development, staging, production) without code changes.

## What Changed

### 1. **New File: `src/config/apiConfig.js`**
   - **Purpose**: Single source of truth for the backend API base URL
   - **How it works**: 
     - Reads `VITE_API_BASE_URL` environment variable
     - Provides `http://localhost:8080` as development fallback
     - Exports `API_BASE_URL` and utility functions
   - **Why**: Eliminates hardcoded URLs and centralizes configuration

### 2. **Updated File: `src/api/axios.js`**
   - **Before**: `baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"`
   - **After**: `baseURL: API_BASE_URL` (imported from config)
   - **Why**: Cleaner code, uses centralized config, easier to debug

### 3. **New File: `.env.example`**
   - **Purpose**: Template for developers to configure their environment
   - **Contents**: 
     - `VITE_API_BASE_URL` with examples for different environments
     - Comments explaining each use case
   - **Why**: Clear documentation of available configuration options

## How to Use

### Development (Local Backend)

1. Create a `.env.local` file (or use `.env.example` as template):
   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The frontend will automatically connect to your local backend.

### Production (Railway or Other Hosting)

1. Set environment variable in deployment platform:
   ```
   VITE_API_BASE_URL=https://your-backend-url.up.railway.app
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

3. The built frontend will use the production backend URL.

### Local with Remote Backend

1. Create `.env.local`:
   ```
   VITE_API_BASE_URL=https://production-backend.com
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Configuration by Environment

| Environment | Where to Set | Value |
|-------------|------------|-------|
| **Development** | `.env.local` or default | `http://localhost:8080` |
| **Staging (Railway)** | Platform env variables | `https://staging.up.railway.app` |
| **Production (Railway)** | Platform env variables | `https://prod.up.railway.app` |
| **Netlify** | Netlify UI > Build & Deploy > Environment | `https://your-api.netlify.app` |

## Files Affected

### API Files (All Using Centralized Config)
- ✅ `src/api/axios.js` - Axios instance (UPDATED)
- ✅ `src/api/auth.api.js` - Authentication APIs
- ✅ `src/api/cart.api.js` - Shopping cart APIs
- ✅ `src/api/checkout.api.js` - Checkout APIs
- ✅ `src/api/order.api.js` - Order APIs
- ✅ `src/api/payment.api.js` - Payment APIs
- ✅ `src/api/paytm.api.js` - Paytm payment APIs
- ✅ `src/api/product.api.js` - Product APIs
- ✅ `src/api/profile.api.js` - Profile APIs
- ✅ `src/api/category.api.js` - Category APIs
- ✅ `src/api/invoice.api.js` - Invoice APIs
- ✅ `src/admin/api/*.js` - Admin APIs (all files)

All API files import the `axios` instance with the centralized base URL.

## Verification

### ✅ No Hardcoded URLs Remaining
All hardcoded backend URLs have been removed:
- ❌ ~~`http://localhost:8080`~~ (now in config only)
- ❌ ~~`https://railway.app`~~ (replaced with env variable)
- ❌ ~~IP addresses~~ (never hardcoded)

### ✅ Single Configuration Point
Only one place to change the backend URL:
- **Development**: `.env.local` file
- **Production**: Platform environment variables (Railway/Netlify)

### ✅ All API Calls Use Centralized Config
Every API call goes through the axios instance which uses `API_BASE_URL`.

## Benefits

1. **Easy Environment Switching**: Change backend URL without rebuilding code
2. **Deployment Ready**: Works with Railway, Netlify, and custom servers
3. **No Code Changes**: Swap backends by changing one environment variable
4. **Clear Documentation**: `.env.example` shows all configuration options
5. **Development Friendly**: Automatic fallback to `localhost:8080`
6. **Debugging**: Config logged to console in development mode

## Testing the Configuration

### Test Local Development
```bash
# Terminal 1: Start backend
cd ../backend
npm start

# Terminal 2: Start frontend
cd ../frontend
npm run dev

# Frontend should connect to http://localhost:8080
```

### Test Production Build Locally
```bash
# Set production URL
echo "VITE_API_BASE_URL=https://api.example.com" > .env.production.local

# Build
npm run build

# Preview (uses production config)
npm run preview
```

## Troubleshooting

### "API calls failing with 404"
1. Verify `VITE_API_BASE_URL` is set correctly
2. Check that backend is running at that URL
3. Open browser console → Check API config logged at startup

### "Environment variable not being picked up"
1. Ensure file is named `.env.local` (for development) or correct platform env vars
2. Restart dev server after changing `.env.local`
3. For Netlify/Railway: use their UI to set variables, not local files

### "How to debug which URL is being used?"
1. Open browser DevTools → Console
2. Look for: `[API CONFIG] 🔧 API Configuration:`
3. Check the `baseUrl` value

## Migration Checklist

For team members:
- [ ] Delete any local `.env` files with hardcoded URLs
- [ ] Copy `.env.example` to `.env.local`
- [ ] Update `.env.local` with your backend URL
- [ ] Restart dev server
- [ ] Test API calls in browser console
- [ ] Verify in Network tab that requests go to correct backend

---

**Last Updated**: January 2026
**Refactored By**: GitHub Copilot
