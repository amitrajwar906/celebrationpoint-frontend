import api from "./axios";

// 📂 CATEGORY APIs (PUBLIC)

// Get all categories
export const getCategories = () => {
  console.log("[CATEGORY] Fetching all categories");
  return api.get("/api/categories");
};
