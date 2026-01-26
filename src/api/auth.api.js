import api from "./axios";

// 🔐 AUTH APIs

// Register new user
export const registerUser = (data) => {
  console.log("[AUTH] Registering user:", data.email);
  return api.post("/api/auth/register", data);
};

// Login user
export const loginUser = (data) => {
  console.log("[AUTH] Logging in user:", data.email);
  return api.post("/api/auth/login", data);
};

// Get current user info (JWT REQUIRED)
export const meApi = () => {
  console.log("[AUTH] Fetching current user info");
  return api.get("/api/auth/me");
};

// Refresh token (if backend supports)
export const refreshToken = () => {
  console.log("[AUTH] Refreshing token");
  return api.post("/api/auth/refresh");
};

// Logout (if backend supports)
export const logoutUser = () => {
  console.log("[AUTH] Logging out");
  return api.post("/api/auth/logout");
};
