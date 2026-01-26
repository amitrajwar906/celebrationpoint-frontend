import apiClient from "../../api/apiClient";

/* =========================================
   ADMIN ORDER CANCELLATIONS API
   Backend: AdminOrderCancelController
   ========================================= */

/**
 * GET all order cancellation requests
 * GET /api/admin/order-cancellations
 */
export const getOrderCancellations = () => {
  return apiClient.get("/api/admin/order-cancellations");
};

/**
 * APPROVE cancellation
 * PUT /api/admin/order-cancellations/{id}/approve
 */
export const approveCancellation = (id) => {
  return apiClient.put(`/api/admin/order-cancellations/${id}/approve`);
};

/**
 * REJECT cancellation
 * PUT /api/admin/order-cancellations/{id}/reject
 */
export const rejectCancellation = (id) => {
  return apiClient.put(`/api/admin/order-cancellations/${id}/reject`);
};
