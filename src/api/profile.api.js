import apiClient from "./apiClient";

/**
 * Get current user profile
 */
export const getProfile = () => {
  console.log("[PROFILE API] Fetching user profile");
  return apiClient.get("/api/auth/me");
};

/**
 * Update current user profile
 */
export const updateProfile = (profileData) => {
  console.log("[PROFILE API] Updating profile with data:", profileData);
  return apiClient.put("/api/auth/profile", profileData);
};

/**
 * Change password
 */
export const changePassword = (oldPassword, newPassword) => {
  console.log("[PROFILE API] Calling change-password endpoint");
  console.log("[PROFILE API] Request body:", {
    oldPassword: oldPassword ? "***" : "",
    newPassword: newPassword ? "***" : "",
  });
  
  return apiClient
    .put("/api/auth/change-password", {
      oldPassword,
      newPassword,
    })
    .then((res) => {
      console.log("[PROFILE API] ✅ Password change response:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("[PROFILE API] ❌ Password change error:", err);
      console.error("[PROFILE API] Error status:", err.response?.status);
      console.error("[PROFILE API] Error data:", err.response?.data);
      throw err;
    });
};
