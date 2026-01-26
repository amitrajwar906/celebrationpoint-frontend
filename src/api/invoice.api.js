import api from "./axios";

// 🧾 INVOICE API (JWT REQUIRED)

// Get invoice for order (returns PDF as blob)
export const getInvoice = (orderId) => {
  console.log(`[INVOICE] Fetching invoice for order ${orderId}`);
  return api.get(`/api/invoices/${orderId}`, {
    responseType: "blob", // IMPORTANT for PDF
  });
};

// Get invoice for admin
export const getAdminInvoice = (orderId) => {
  console.log(`[INVOICE] Fetching admin invoice for order ${orderId}`);
  return api.get(`/api/invoices/admin/${orderId}`, {
    responseType: "blob",
  });
};
