import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// Debug: Log axios initialization
console.log("[AXIOS] 🔧 Creating axios instance with baseURL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Ensure credentials aren't needed for CORS
});

// Debug: Verify instance created
console.log("[AXIOS] ✅ Axios instance created successfully");

// REQUEST INTERCEPTOR (ATTACH JWT + DETAILED LOGGING)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Log full URL being called
    console.log(`[AXIOS REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[AXIOS] ✅ JWT attached - Token: ${token.substring(0, 20)}...`);
    } else {
      console.warn(`[AXIOS] ⚠️ NO TOKEN - Request may fail if endpoint requires auth`);
    }

    return config;
  },
  (error) => {
    console.error("[AXIOS] ❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR (HANDLE AUTH ERRORS + DETAILED LOGGING)
api.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS] ✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.response?.config?.url || error.config?.url;
    const method = error.response?.config?.method?.toUpperCase() || error.config?.method?.toUpperCase();
    const baseURL = error.response?.config?.baseURL || error.config?.baseURL || "UNKNOWN";
    
    console.error(`[AXIOS] ❌ ${status} ${method} ${baseURL}${url}`);
    console.error(`[AXIOS] Full URL attempted: ${baseURL}${url}`);
    console.error(`[AXIOS] Response Status:`, status);
    console.error(`[AXIOS] Response Data:`, error.response?.data);
    console.error(`[AXIOS] Error Message:`, error.message);
    console.error(`[AXIOS] Network Error Code:`, error.code); // Network timeouts, CORS, etc.

    // Handle 401 (expired/invalid token)
    if (status === 401) {
      console.warn("[AXIOS] 🔐 401 Unauthorized - JWT expired or invalid. Logging out.");

      // Clear ALL auth keys
      localStorage.removeItem("token");

      // Dispatch logout event so AuthContext can react
      window.dispatchEvent(new CustomEvent("logout"));

      // Optional: redirect to home
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Handle 403 (unauthorized action)
    if (status === 403) {
      console.warn("[AXIOS] 🚫 403 Forbidden - Access denied");
    }

    // Handle 400 (bad request)
    if (status === 400) {
      console.error("[AXIOS] ❌ 400 Bad Request - Check backend error details above");
    }

    return Promise.reject(error);
  }
);

export default api;
