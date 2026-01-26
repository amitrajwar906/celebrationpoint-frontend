import apiClient from "./apiClient";

// 🛍️ PRODUCT APIs (PUBLIC)

// Get all products
export const getProducts = () => {
  console.log("[PRODUCT] Fetching all products");
  return apiClient.get("/api/products");
};

// Get single product by ID
export const getProductById = (id) => {
  console.log(`[PRODUCT] Fetching product ${id}`);
  return apiClient.get(`/api/products/${id}`);
};

// Get products by category
export const getProductsByCategory = (categoryId) => {
  console.log(`[PRODUCT] Fetching products for category ${categoryId}`);
  return apiClient.get(`/api/products/category/${categoryId}`);
};
