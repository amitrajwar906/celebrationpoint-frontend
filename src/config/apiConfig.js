/**
 * Centralized API Configuration
 * 
 * This file exports the base URL for all backend API calls.
 * It uses Vite environment variables with a fallback for development.
 * 
 * USAGE:
 * - All API modules should import this instead of hardcoding URLs
 * - The axios instance uses this for its baseURL
 * - Changing the environment variable updates all API calls automatically
 * 
 * ENVIRONMENT VARIABLE:
 * - VITE_API_BASE_URL: Backend API base URL
 *   - Development: http://localhost:8080 (default)
 *   - Production/Railway: https://your-railway-app.up.railway.app
 *   - Local: http://localhost:8080
 * 
 * @example
 * // In .env.local or .env.production
 * VITE_API_BASE_URL=https://your-api.com
 * 
 * // In any API file
 * import { API_BASE_URL } from '../config/apiConfig';
 * console.log(API_BASE_URL); // https://your-api.com or http://localhost:8080
 */

/**
 * Get the API base URL from Vite environment variables
 * with a development fallback
 */
const getApiBaseUrl = () => {
  // First, check if VITE_API_BASE_URL is set (production/deployment)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback for development
  return "http://localhost:8080";
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Export for debugging (shows current configuration)
 */
export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  environment: {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "undefined",
  },
});

// Log configuration (ALWAYS, even in production for debugging)
console.log("[API CONFIG] 🔧 Vite Environment Variables:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "NOT SET",
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  SSR: import.meta.env.SSR,
});
console.log("[API CONFIG] ✅ Using API Base URL:", API_BASE_URL);

if (import.meta.env.DEV) {
  console.log("[API CONFIG] 🔧 Full Configuration:", getApiConfig());
}

export default API_BASE_URL;
