import api from "./axios";

// 💳 PAYMENT APIs (JWT REQUIRED)

// Initiate payment (online)
export const initiatePayment = (data) => {
  console.log("[PAYMENT] Initiating payment:", data);
  return api.post("/api/payments/initiate", data);
};

// Payment success callback
export const paymentSuccess = (data) => {
  console.log("[PAYMENT] Marking payment success:", data);
  return api.post("/api/payments/success", data);
};

// Payment failed callback
export const paymentFailed = (data) => {
  console.log("[PAYMENT] Marking payment failed:", data);
  return api.post("/api/payments/failed", data);
};

// Get payment by order ID
export const getPaymentByOrder = (orderId) => {
  console.log(`[PAYMENT] Getting payment for order ${orderId}`);
  return api.get(`/api/payments/order/${orderId}`);
};
