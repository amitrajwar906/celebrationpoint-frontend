import apiClient from "./apiClient";

// ================= CART APIs =================

// 👀 View cart
export const getCart = () => {
  console.log("[CART] Fetching cart");
  return apiClient.get("/api/cart");
};

// ➕ Add to cart
export const addToCart = (data) => {
  console.log("[CART] Adding to cart:", data);
  return apiClient.post("/api/cart/add", data);
};

// 🔄 Update quantity (USE cartItemId)
export const updateCartItem = (cartItemId, quantity) => {
  console.log(`[CART] Updating item ${cartItemId} to quantity ${quantity}`);
  return apiClient.put(`/api/cart/item/${cartItemId}`, {
    quantity,
  });
};

// ❌ Remove item (USE cartItemId)
export const removeCartItem = (cartItemId) => {
  console.log(`[CART] Removing item ${cartItemId}`);
  return apiClient.delete(`/api/cart/item/${cartItemId}`);
};

// 🗑️ Clear entire cart
export const clearCart = () => {
  console.log("[CART] Clearing entire cart");
  return apiClient.delete("/api/cart/clear");
};
