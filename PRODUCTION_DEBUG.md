# Production Data Fetching Debug Guide

## Problem Summary
- ✅ Backend is running and accessible
- ❌ Frontend deployed on Netlify is NOT fetching data
- Likely causes: Wrong API base URL, CORS issues, or environment variables not set

## Critical Checklist

### 1. ✅ Netlify Environment Variables (MUST DO THIS FIRST)

**Status**: Missing in production

**Fix**:
1. Go to Netlify Dashboard
2. Click on your site → **Build & Deploy** → **Environment**
3. Add new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://celebrationpoint-backend-production.up.railway.app`
4. Click **Save**
5. **REDEPLOY** your site (Deploys menu → Trigger deploy)

**Why**: Netlify build process needs this variable to inject into the frontend code.

### 2. ✅ Verify Environment Variable is Accessible

The code now automatically logs what URL is being used:

**In Netlify deployment**:
1. Open your site in browser
2. Press `F12` → **Console** tab
3. Look for these logs:

```
[API CONFIG] 🔧 Vite Environment Variables: {
  VITE_API_BASE_URL: "https://celebrationpoint-backend-production.up.railway.app",
  DEV: false,
  PROD: true
}
[API CONFIG] ✅ Using API Base URL: https://celebrationpoint-backend-production.up.railway.app
[AXIOS] 🔧 Creating axios instance with baseURL: https://celebrationpoint-backend-production.up.railway.app
[AXIOS] ✅ Axios instance created successfully
```

If you see `VITE_API_BASE_URL: "NOT SET"` → **Go back to step 1**

### 3. ✅ Check Network Requests

**In browser DevTools**:
1. Open **Network** tab
2. Refresh page
3. Look for API calls to `https://celebrationpoint-backend-production.up.railway.app/api/...`

**What to look for**:
- ✅ URL starts with `https://celebrationpoint-backend-production.up.railway.app`
- ❌ URL is `/api/...` (relative path) - WRONG
- ❌ URL is `http://localhost:8080` - WRONG

**If requests fail**, check the response:
- **Status 404**: Backend route doesn't exist (check path matches backend)
- **Status 500**: Backend error (check backend logs)
- **Status 0 or CORS error**: Backend not allowing requests (add CORS headers)
- **Status -1 or timeout**: Backend unreachable (check URL)

### 4. ✅ Verify API Paths Match Backend

Each API call should match a backend endpoint:

| Frontend Path | Backend Endpoint | Status |
|---|---|---|
| `/api/products` | `GET /api/products` | ✅ |
| `/api/categories` | `GET /api/categories` | ✅ |
| `/api/cart` | `GET /api/cart` | ✅ |
| `/api/auth/login` | `POST /api/auth/login` | ✅ |
| `/api/auth/me` | `GET /api/auth/me` | ✅ |
| `/api/orders` | `GET /api/orders` | ✅ |

All paths look correct and will be prefixed with the base URL automatically.

### 5. ✅ CORS Configuration

Your backend (Railway) must have CORS enabled:

**Backend needs these headers**:
```
Access-Control-Allow-Origin: https://your-netlify-site.netlify.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: false
```

**Quick check**: Try this in browser console:
```javascript
// This will show if CORS is the issue
fetch('https://celebrationpoint-backend-production.up.railway.app/api/products', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(d => console.log('SUCCESS:', d))
.catch(e => console.error('FAILED:', e.message))
```

If it fails with `Cross-Origin Request Blocked` → Backend CORS issue

### 6. ✅ Verify Backend is Actually Running

Open in browser:
```
https://celebrationpoint-backend-production.up.railway.app/api/products
```

If you see:
- ✅ JSON data → Backend is working
- ❌ Error page → Backend is down or route doesn't exist
- ❌ Connection timeout → Railway deployment is not running

### 7. ✅ Console Logs Show Full Request Details

Now with enhanced logging, you'll see:

```
[AXIOS REQUEST] GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] ✅ 200 GET https://celebrationpoint-backend-production.up.railway.app/api/products
```

Or if there's an error:

```
[AXIOS REQUEST] GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] ❌ 0 GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] Full URL attempted: https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] Error Message: Network Error
[AXIOS] Network Error Code: ERR_NETWORK
```

## Step-by-Step Production Fix

### Step 1: Set Netlify Environment Variable
```
Netlify Dashboard → Build & Deploy → Environment
Add: VITE_API_BASE_URL = https://celebrationpoint-backend-production.up.railway.app
```

### Step 2: Redeploy
```
Netlify Dashboard → Deploys → Trigger Deploy
```

### Step 3: Verify in Browser Console
```
F12 → Console → Look for logs
```

### Step 4: Check Network Tab
```
F12 → Network → Refresh
Look for API calls to correct URL
```

### Step 5: Test Backend Directly
```
Visit: https://celebrationpoint-backend-production.up.railway.app/api/products
Should return JSON (not error page)
```

## Files Modified for Debugging

### `src/config/apiConfig.js`
- Now logs all environment variables
- Logs the chosen base URL
- Logs at startup (not just dev mode)

### `src/api/axios.js`
- Logs axios instance creation with base URL
- Logs full URL (baseURL + path) for every request
- Logs errors with full context (network code, response data)

## Expected Console Output - SUCCESS

```
[API CONFIG] 🔧 Vite Environment Variables: {
  VITE_API_BASE_URL: "https://celebrationpoint-backend-production.up.railway.app",
  DEV: false,
  PROD: true,
  SSR: false
}
[API CONFIG] ✅ Using API Base URL: https://celebrationpoint-backend-production.up.railway.app
[AXIOS] 🔧 Creating axios instance with baseURL: https://celebrationpoint-backend-production.up.railway.app
[AXIOS] ✅ Axios instance created successfully
[AXIOS REQUEST] GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] ✅ 200 GET https://celebrationpoint-backend-production.up.railway.app/api/products
Products loaded successfully!
```

## Expected Console Output - FAILURE (CORS)

```
[API CONFIG] ✅ Using API Base URL: https://celebrationpoint-backend-production.up.railway.app
[AXIOS] ✅ Axios instance created successfully
[AXIOS REQUEST] GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] ❌ 0 GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] Error Message: Network Error
[AXIOS] Network Error Code: ERR_NETWORK
```
→ **Check CORS headers on backend**

## Expected Console Output - FAILURE (Wrong URL)

```
[API CONFIG] ✅ Using API Base URL: http://localhost:8080
[AXIOS] ✅ Axios instance created successfully
[AXIOS REQUEST] GET http://localhost:8080/api/products
[AXIOS] ❌ 0 GET http://localhost:8080/api/products
```
→ **Netlify env variable not set. Go to step 1.**

## Quick Reference

| Symptom | Cause | Fix |
|---------|-------|-----|
| Console shows `VITE_API_BASE_URL: "NOT SET"` | Env var not in Netlify | Set it in Netlify Build & Deploy |
| Console shows `http://localhost:8080` | Using fallback URL | Env var not set in Netlify |
| Network shows `/api/...` paths | Relative URLs (shouldn't happen) | All should be full URLs now |
| Network shows correct URL but 0 status | CORS issue | Fix CORS on backend |
| Network shows 404 | Route doesn't exist | Check backend endpoints match |
| Network shows 500 | Backend error | Check backend logs |
| Products load in dev, not in production | Env var set locally, not in Netlify | Set in Netlify |

---

**If still stuck**: Open browser console and share the logs from steps 2-3 above.
