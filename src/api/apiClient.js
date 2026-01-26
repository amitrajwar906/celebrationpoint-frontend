import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// ============================================================================
// PRODUCTION DEBUGGING: Verify environment variable is available at runtime
// ============================================================================
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("[API CLIENT] 🔧 Initializing API Client");
console.log("[API CLIENT] Environment:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "NOT SET ❌",
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});
console.log("[API CLIENT] Resolved Base URL:", API_BASE_URL);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// ============================================================================
// Create the SINGLE axios instance for all API calls
// ============================================================================
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 30000, // 30 second timeout
});

// ============================================================================
// REQUEST INTERCEPTOR: Add JWT token + log all requests
// ============================================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Log the full URL with method
    const fullURL = `${config.baseURL}${config.url}`;
    console.log(`[API] 📤 ${config.method?.toUpperCase()} ${fullURL}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] 🔑 JWT Token attached`);
    } else {
      console.log(`[API] ⚠️ No JWT Token (endpoint may require auth)`);
    }

    return config;
  },
  (error) => {
    console.error("[API] ❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR: Handle errors + log all responses
// ============================================================================
apiClient.interceptors.response.use(
  (response) => {
    const fullURL = `${response.config.baseURL}${response.config.url}`;
    console.log(`[API] ✅ ${response.status} ${response.config.method?.toUpperCase()} ${fullURL}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.response?.config?.url || error.config?.url || "UNKNOWN";
    const method = error.response?.config?.method?.toUpperCase() || error.config?.method?.toUpperCase() || "UNKNOWN";
    const baseURL = error.response?.config?.baseURL || error.config?.baseURL || "UNKNOWN";
    const fullURL = `${baseURL}${url}`;

    console.error(`[API] ❌ ${status || "ERROR"} ${method} ${fullURL}`);
    console.error(`[API] Error Code:`, error.code);
    console.error(`[API] Error Message:`, error.message);
    if (error.response?.data) {
      console.error(`[API] Response Data:`, error.response.data);
    }

    // Handle 401: Clear token and redirect
    if (status === 401) {
      console.warn("[API] 🔐 401 Unauthorized - Token expired or invalid");
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("logout"));
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Handle 403: Access denied
    if (status === 403) {
      console.warn("[API] 🚫 403 Forbidden - Access denied");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
