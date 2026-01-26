import apiClient from "./apiClient";

// 📂 CATEGORY APIs (PUBLIC)

// Get all categories
export const getCategories = () => {
  console.log("[CATEGORY] Fetching all categories");
  return apiClient.get("/api/categories");
};
