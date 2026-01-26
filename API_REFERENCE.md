# API Configuration Reference Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│           React Components (Pages & Components)          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓ Uses
┌─────────────────────────────────────────────────────────┐
│      API Modules (src/api/*.js, src/admin/api/*.js)     │
│  - auth.api.js                                          │
│  - product.api.js                                       │
│  - order.api.js                                         │
│  - payment.api.js                                       │
│  - etc.                                                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓ All use
┌─────────────────────────────────────────────────────────┐
│         Axios Instance (src/api/axios.js)               │
│  - baseURL: from API_BASE_URL                           │
│  - JWT interceptor                                      │
│  - Error handling                                       │
│  - Logging                                              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓ Gets URL from
┌─────────────────────────────────────────────────────────┐
│    API Config (src/config/apiConfig.js)                 │
│  - Reads: import.meta.env.VITE_API_BASE_URL             │
│  - Fallback: http://localhost:8080                      │
│  - Logs: Configuration at startup                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓ Gets value from
┌─────────────────────────────────────────────────────────┐
│    Environment Variable                                 │
│  - Development: .env.local file                         │
│  - Production (Netlify): Build & Deploy → Environment   │
│  - Key: VITE_API_BASE_URL                               │
└─────────────────────────────────────────────────────────┘
```

## Configuration Flow

### Development Flow
```
1. npm run dev
2. Reads .env.local (if exists)
3. import.meta.env.VITE_API_BASE_URL = value from .env.local
4. If .env.local missing → import.meta.env.VITE_API_BASE_URL = undefined
5. apiConfig.js uses fallback → "http://localhost:8080"
6. axios baseURL = "http://localhost:8080"
```

### Production Flow (Netlify)
```
1. Netlify detects Build & Deploy → Environment variable
2. Netlify runs: npm run build
3. Vite injects VITE_API_BASE_URL into build
4. import.meta.env.VITE_API_BASE_URL = "https://celebrationpoint-backend-production.up.railway.app"
5. apiConfig.js uses this value
6. axios baseURL = "https://celebrationpoint-backend-production.up.railway.app"
```

## File Structure

### Core Files

```
src/
├── config/
│   └── apiConfig.js              ← CENTRAL: Exports API_BASE_URL
│
├── api/
│   ├── axios.js                  ← CRITICAL: Creates axios instance
│   ├── auth.api.js               ← Uses: import api from "./axios"
│   ├── product.api.js            ← Uses: import api from "./axios"
│   ├── order.api.js              ← Uses: import api from "./axios"
│   ├── payment.api.js            ← Uses: import api from "./axios"
│   ├── cart.api.js               ← Uses: import api from "./axios"
│   ├── category.api.js           ← Uses: import api from "./axios"
│   ├── checkout.api.js           ← Uses: import api from "./axios"
│   ├── invoice.api.js            ← Uses: import api from "./axios"
│   ├── profile.api.js            ← Uses: import api from "./axios"
│   └── paytm.api.js              ← Uses: import axios from "./axios"
│
├── admin/api/
│   ├── admin.products.api.js     ← Uses: import api from "../../api/axios"
│   ├── admin.orders.api.js       ← Uses: import api from "../../api/axios"
│   ├── admin.categories.api.js   ← Uses: import api from "../../api/axios"
│   ├── admin.audit.api.js        ← Uses: import api from "../../api/axios"
│   └── admin.cancellations.api.js← Uses: import api from "../../api/axios"
│
└── pages/
    ├── Home.jsx                  ← Uses: import { getProducts } from "../api/product.api"
    ├── Products.jsx              ← Uses: import { getProducts, getCategories }
    ├── ProductDetails.jsx        ← Uses: import { getProductById, getProductsByCategory }
    ├── Cart.jsx                  ← Uses: import { getCart, addToCart, ... }
    └── etc.

.env.example                       ← Template (commit to repo)
.env.local                         ← Local development (do NOT commit)
.gitignore                         ← Ignores .env* files
```

## API Endpoints Reference

### Authentication APIs
```javascript
import { registerUser, loginUser, meApi, refreshToken } from "../api/auth.api";

registerUser(data)        → POST /api/auth/register
loginUser(data)           → POST /api/auth/login
meApi()                   → GET /api/auth/me (requires JWT)
refreshToken()            → POST /api/auth/refresh
```

### Product APIs
```javascript
import { getProducts, getProductById, getProductsByCategory } from "../api/product.api";

getProducts()                      → GET /api/products
getProductById(id)                 → GET /api/products/:id
getProductsByCategory(categoryId)  → GET /api/products/category/:categoryId
```

### Category APIs
```javascript
import { getCategories } from "../api/category.api";

getCategories()  → GET /api/categories
```

### Cart APIs
```javascript
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../api/cart.api";

getCart()                        → GET /api/cart
addToCart(data)                  → POST /api/cart/add
updateCartItem(cartItemId, qty)  → PUT /api/cart/item/:cartItemId
removeCartItem(cartItemId)       → DELETE /api/cart/item/:cartItemId
clearCart()                      → DELETE /api/cart/clear
```

### Order APIs
```javascript
import { getOrders, getOrderItems, cancelOrder } from "../api/order.api";

getOrders()                → GET /api/orders (requires JWT)
getOrderItems(orderId)     → GET /api/orders/:orderId/items
cancelOrder(orderId)       → POST /api/orders/:orderId/cancel
```

### Payment APIs
```javascript
import { initiatePayment, paymentSuccess, paymentFailed, getPaymentByOrder } from "../api/payment.api";

initiatePayment(data)        → POST /api/payments/initiate
paymentSuccess(data)         → POST /api/payments/success
paymentFailed(data)          → POST /api/payments/failed
getPaymentByOrder(orderId)   → GET /api/payments/order/:orderId
```

### Paytm APIs
```javascript
import { initiatePaytmPayment, getPaytmGatewayUrl, redirectToPaytmGateway } from "../api/paytm.api";

initiatePaytmPayment(orderId)   → POST /api/paytm/initiate
getPaytmGatewayUrl()            → GET /api/paytm/gateway-url
redirectToPaytmGateway(orderId) → Submits form to Paytm
```

### Admin APIs
```javascript
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../admin/api/admin.products.api";
import { getAllOrders, updateOrderStatus } from "../admin/api/admin.orders.api";
import { getCategories, createCategory, updateCategory } from "../admin/api/admin.categories.api";
import { getAuditLogs } from "../admin/api/admin.audit.api";
import { getOrderCancellations } from "../admin/api/admin.cancellations.api";
```

## Console Logging Reference

### Development Startup (F12 → Console)
```
[API CONFIG] 🔧 Vite Environment Variables: {
  VITE_API_BASE_URL: "http://localhost:8080",
  DEV: true,
  PROD: false,
  SSR: false
}
[API CONFIG] ✅ Using API Base URL: http://localhost:8080
[API CONFIG] 🔧 Full Configuration: {...}
[AXIOS] 🔧 Creating axios instance with baseURL: http://localhost:8080
[AXIOS] ✅ Axios instance created successfully
```

### Production Startup (F12 → Console)
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
```

### Successful API Call
```
[AXIOS REQUEST] GET http://localhost:8080/api/products
[AXIOS] ✅ 200 GET http://localhost:8080/api/products
```

### Failed API Call (404)
```
[AXIOS REQUEST] POST http://localhost:8080/api/auth/login
[AXIOS] ❌ 401 POST http://localhost:8080/api/auth/login
[AXIOS] Full URL attempted: http://localhost:8080/api/auth/login
[AXIOS] Response Status: 401
[AXIOS] Response Data: {error: "Invalid credentials"}
[AXIOS] Error Message: Request failed with status code 401
```

### Failed API Call (Network Error)
```
[AXIOS REQUEST] GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] ❌ 0 GET https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] Full URL attempted: https://celebrationpoint-backend-production.up.railway.app/api/products
[AXIOS] Network Error Code: ERR_NETWORK
[AXIOS] Error Message: Network Error
```

## How to Use in Components

### Example 1: Fetch Products
```javascript
import { useEffect, useState } from "react";
import { getProducts } from "../api/product.api";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

### Example 2: Login
```javascript
import { loginUser } from "../api/auth.api";

function Login() {
  const handleLogin = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      // Refresh page or update auth context
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error);
    }
  };
  // ...
}
```

### Example 3: Add to Cart
```javascript
import { addToCart } from "../api/cart.api";

function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1
      });
      // Show success toast
    } catch (err) {
      // Show error toast
    }
  };
  // ...
}
```

## Environment Variable Rules

### Development (.env.local)
```
# Set this to test with different backends
VITE_API_BASE_URL=http://localhost:8080
```

### Production (Netlify Dashboard)
```
Build & Deploy → Environment → Add Variable
Key: VITE_API_BASE_URL
Value: https://celebrationpoint-backend-production.up.railway.app
```

### Build Process
- Vite reads env variables during build time
- Must be set BEFORE running npm run build
- In Netlify: automatically done if set in dashboard

## Troubleshooting Checklist

- [ ] Check Netlify has `VITE_API_BASE_URL` set
- [ ] Check console shows correct base URL
- [ ] Check Network tab shows full URLs (not relative)
- [ ] Check Network responses (200, 4xx, 5xx, 0)
- [ ] Test backend directly in browser
- [ ] Check backend CORS headers
- [ ] Verify API paths match backend routes
- [ ] Check JWT token in localStorage if auth required

---

**Always check browser console first for diagnostic logs!**
