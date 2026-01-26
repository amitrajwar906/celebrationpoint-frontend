import apiClient from "../../api/apiClient";

/**
 * Get all products (admin view)
 */
export const getAllProducts = () => {
  console.log("[PRODUCTS API] Fetching all products");
  return apiClient.get("/api/admin/products");
};

/**
 * Get product by ID
 */
export const getProductById = (id) => {
  console.log("[PRODUCTS API] Fetching product:", id);
  return apiClient.get(`/api/admin/products/${id}`);
};

/**
 * Create new product
 */
export const createProduct = (productData) => {
  console.log("[PRODUCTS API] Creating product:", productData);
  return apiClient.post("/api/admin/products", productData);
};

/**
 * Update product
 */
export const updateProduct = (id, productData) => {
  console.log("[PRODUCTS API] Updating product:", id, productData);
  return apiClient.put(`/api/admin/products/${id}`, productData);
};

/**
 * Delete product
 */
export const deleteProduct = (id) => {
  console.log("[PRODUCTS API] Deleting product:", id);
  return apiClient.delete(`/api/admin/products/${id}`)
    .then(res => {
      console.log("[PRODUCTS API] Delete successful:", res.data);
      return res;
    })
    .catch(err => {
      console.error("[PRODUCTS API] Delete failed:", err.response?.status, err.response?.data);
      throw err;
    });
};

/**
 * Toggle product status
 */
export const toggleProductStatus = (id, active) => {
  console.log("[PRODUCTS API] Toggling product status:", id, active);
  return apiClient.patch(`/api/admin/products/${id}/status`, {}, {
    params: { active },
  });
};
