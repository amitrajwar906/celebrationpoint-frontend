import apiClient from "./apiClient";

// 💳 PAYMENT APIs (JWT REQUIRED)

// Initiate payment (online)
export const initiatePayment = (data) => {
  console.log("[PAYMENT] Initiating payment:", data);
  return apiClient.post("/api/payments/initiate", data);
};

// Payment success callback
export const paymentSuccess = (data) => {
  console.log("[PAYMENT] Marking payment success:", data);
  return apiClient.post("/api/payments/success", data);
};

// Payment failed callback
export const paymentFailed = (data) => {
  console.log("[PAYMENT] Marking payment failed:", data);
  return apiClient.post("/api/payments/failed", data);
};

// Get payment by order ID
export const getPaymentByOrder = (orderId) => {
  console.log(`[PAYMENT] Getting payment for order ${orderId}`);
  return apiClient.get(`/api/payments/order/${orderId}`);
};
