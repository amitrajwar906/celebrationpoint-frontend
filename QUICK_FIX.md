# QUICK FIX REFERENCE - ONE PAGE

## The Problem
Frontend on Netlify → Not fetching data from Railway backend
Backend is running ✅ | Frontend code is correct ✅ | But data won't load ❌

## The Root Cause
**Missing environment variable in Netlify** + **No production debugging**

## The Fix (3 Steps)

### Step 1: Set Netlify Environment Variable
```
Netlify Dashboard
  ↓
Your Site → Build & Deploy → Environment
  ↓
Add new variable:
  Key: VITE_API_BASE_URL
  Value: https://celebrationpoint-backend-production.up.railway.app
  ↓
Click Save
```

### Step 2: Redeploy
```
Netlify Dashboard → Deploys → Trigger Deploy
Wait for build to complete
```

### Step 3: Verify in Browser
```
1. Open your Netlify site
2. Press F12 → Console
3. Look for: [API CONFIG] ✅ Using API Base URL: https://celebrationpoint-backend-production...
4. Refresh page
5. Check data loads (products, categories, etc.)
```

## What Changed in Code

### Before
```javascript
// Only logged in development
if (import.meta.env.DEV) {
  console.log("Config:", config);
}
// Production: No logs = Can't diagnose
```

### After
```javascript
// Always logs (even in production)
console.log("[API CONFIG] Using API Base URL:", API_BASE_URL);
console.log("[AXIOS REQUEST]", method, baseURL + path);
console.log("[AXIOS] Error Code:", error.code); // ERR_NETWORK, ERR_CORS, etc.
// Production: Full visibility = Easy diagnosis
```

## Console Logs Tell the Story

| What You See | What It Means | What To Do |
|---|---|---|
| `VITE_API_BASE_URL: "NOT SET"` | Env var not in Netlify | Go to Step 1 above |
| `http://localhost:8080` | Using fallback (dev) | Go to Step 1 above |
| `https://celebrationpoint...` | ✅ Correct URL set | Refresh page, check Network tab |
| `ERR_NETWORK` | Can't reach backend | Test URL in browser directly |
| `ERR_CORS` | Backend blocks this origin | Add CORS headers to backend |
| `404` | Route doesn't exist | Check backend endpoints |

## Network Tab Should Show

✅ **URL**: `https://celebrationpoint-backend-production.up.railway.app/api/products`
❌ **NOT**: `/api/products` or `http://localhost:8080/api/products`

✅ **Status**: 200, 400, 401, 404, 500, etc.
❌ **NOT**: Status 0 (unless CORS issue)

## Test Commands

### Local Development
```bash
echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local
npm run dev
# Should work with local backend
```

### Production Build Locally
```bash
echo "VITE_API_BASE_URL=https://celebrationpoint-backend-production.up.railway.app" > .env.production.local
npm run build
npm run preview
# Should work with production backend
```

### Test Backend Directly
```
Open in browser:
https://celebrationpoint-backend-production.up.railway.app/api/products

Should show JSON (not error page)
```

## Files Modified

1. ✏️ `src/config/apiConfig.js` - Added production logging
2. ✏️ `src/api/axios.js` - Added detailed request/response/error logging
3. 📝 `.env.example` - Added deployment instructions
4. 📄 `PRODUCTION_DEBUG.md` - New detailed troubleshooting guide
5. 📄 `PRODUCTION_FIX_SUMMARY.md` - New summary
6. 📄 `API_REFERENCE.md` - New API endpoints reference
7. 📄 `TECHNICAL_ANALYSIS.md` - New technical deep-dive

## Expected Success Output

```
[API CONFIG] 🔧 Vite Environment Variables: {
  VITE_API_BASE_URL: "https://celebrationpoint-backend-production.up.railway.app",
  DEV: false,
  PROD: true
}
[API CONFIG] ✅ Using API Base URL: https://celebrationpoint-backend-production.up.railway.app
[AXIOS] 🔧 Creating axios instance with baseURL: https://celebrationpoint-backend-production.up.railway.app
[AXIOS] ✅ Axios instance created successfully
[AXIOS REQUEST] GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] ✅ 200 GET https://celebrationpoint-backend-production.up.railway.app/api/products
```
→ Products load on page ✅

## If Still Stuck

1. **Verify Netlify setting**: Go to Dashboard, check VITE_API_BASE_URL is there
2. **Check cache**: Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. **Wait for deploy**: New environment variables take effect after redeploy
4. **Test backend**: Visit URL directly to verify it's running
5. **Check CORS**: Backend must allow requests from your Netlify domain

## Key Insight

Environment variables must be set **BEFORE** the build happens.

- Local dev: Set in `.env.local` before `npm run dev`
- Netlify production: Set in Dashboard before triggering deploy

That's it! 🚀
