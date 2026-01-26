import api from "./axios";

// ================= CART APIs =================

// 👀 View cart
export const getCart = () => {
  console.log("[CART] Fetching cart");
  return api.get("/api/cart");
};

// ➕ Add to cart
export const addToCart = (data) => {
  console.log("[CART] Adding to cart:", data);
  return api.post("/api/cart/add", data);
};

// 🔄 Update quantity (USE cartItemId)
export const updateCartItem = (cartItemId, quantity) => {
  console.log(`[CART] Updating item ${cartItemId} to quantity ${quantity}`);
  return api.put(`/api/cart/item/${cartItemId}`, {
    quantity,
  });
};

// ❌ Remove item (USE cartItemId)
export const removeCartItem = (cartItemId) => {
  console.log(`[CART] Removing item ${cartItemId}`);
  return api.delete(`/api/cart/item/${cartItemId}`);
};

// 🗑️ Clear entire cart
export const clearCart = () => {
  console.log("[CART] Clearing entire cart");
  return api.delete("/api/cart/clear");
};
