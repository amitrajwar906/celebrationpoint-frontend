import api from "../../api/axios";

/* =========================================
   ADMIN ORDERS API
   Backend Controllers:
   - AdminOrderController
   - AdminOrderCancelController
   ========================================= */

/**
 * ✅ GET all orders (Admin)
 * GET /api/admin/orders
 */
export const getAllOrders = (params = {}) => {
  return api.get("/api/admin/orders", {
    params, // pagination / filters (future ready)
  });
};

/**
 * ✅ GET single order by ID (Admin)
 * GET /api/admin/orders/{orderId}
 */
export const getOrderById = (orderId) => {
  return api.get(`/api/admin/orders/${orderId}`);
};

/**
 * ✅ UPDATE order status
 * PUT /api/admin/orders/{orderId}/status
 * body: { status: "SHIPPED" | "DELIVERED" | etc }
 */
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/api/admin/orders/${orderId}/status`, {
    status,
  });
};

/**
 * ❌ CANCEL order by admin
 * POST /api/admin/orders/{orderId}/cancel
 */
export const cancelOrderByAdmin = (orderId) => {
  return api.post(`/api/admin/orders/${orderId}/cancel`);
};

/**
 * ✅ GET order items (Admin)
 * GET /api/admin/orders/{orderId}/items
 */
export const getAdminOrderItems = (orderId) => {
  return api.get(`/api/admin/orders/${orderId}/items`);
};
