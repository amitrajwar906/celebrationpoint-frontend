import api from "./axios";

// ==============================
// 📦 ORDER APIs (JWT REQUIRED)
// ==============================

/**
 * 🔹 Get all orders of logged-in user
 * GET /api/orders
 * Returns: List<Order>
 */
export const getOrders = () => {
  console.log("[ORDER] Fetching user orders");
  
  // Check if token exists
  const token = localStorage.getItem("token");
  console.log("[ORDER] Token exists:", !!token);
  console.log("[ORDER] Token preview:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
  
  return api.get("/api/orders");
};

/**
 * 🔹 Get order items for a specific order
 * GET /api/orders/{orderId}/items
 * Returns: List<OrderItemResponse>
 */
export const getOrderItems = (orderId) => {
  console.log(`[ORDER] Fetching items for order ${orderId}`);
  return api.get(`/api/orders/${orderId}/items`);
};

/**
 * 🔹 Cancel order by user
 * POST /api/orders/{orderId}/cancel
 * Returns: { message: string }
 */
export const cancelOrder = (orderId) => {
  console.log(`[ORDER] Cancelling order ${orderId}`);
  return api.post(`/api/orders/${orderId}/cancel`);
};
