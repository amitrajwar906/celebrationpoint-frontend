import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR (ATTACH JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[AXIOS] ✅ JWT attached to ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`[AXIOS] Authorization header: Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn(`[AXIOS] ⚠️ NO TOKEN for ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (HANDLE AUTH ERRORS)
api.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS] ✅ Success: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.response?.config?.url || error.config?.url;
    const method = error.response?.config?.method?.toUpperCase() || error.config?.method?.toUpperCase();
    
    console.error(`[AXIOS] ❌ Error: ${status} ${method} ${url}`);
    console.error(`[AXIOS] Error Data:`, error.response?.data);
    console.error(`[AXIOS] Error Message:`, error.message);

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
