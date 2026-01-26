import api from "./axios";

// 📦 CHECKOUT API (JWT REQUIRED)

// Place order from cart
export const createCheckout = (data) => {
  console.log("[CHECKOUT] Creating order with data:", JSON.stringify(data, null, 2));
  console.log("[CHECKOUT] Data keys:", Object.keys(data));
  console.log("[CHECKOUT] Data values present:", {
    fullName: !!data.fullName,
    phone: !!data.phone,
    addressLine: !!data.addressLine,
    shippingAddress: !!data.shippingAddress,
    city: !!data.city,
    state: !!data.state,
    postalCode: !!data.postalCode,
    paymentMethod: !!data.paymentMethod,
  });
  
  // Check if JWT token exists
  const token = localStorage.getItem("token");
  console.log("[CHECKOUT] JWT Token exists:", !!token);
  if (!token) {
    console.warn("[CHECKOUT] ⚠️ NO JWT TOKEN - Request will fail with 401!");
  }
  
  return api.post("/api/checkout", data)
    .then(res => {
      console.log("[CHECKOUT] ✅ Success - Order created:", res.data);
      return res;
    })
    .catch(err => {
      console.error("[CHECKOUT] ❌ API Error Status:", err.response?.status);
      console.error("[CHECKOUT] ❌ API Error Data:", err.response?.data);
      console.error("[CHECKOUT] ❌ Error Message:", err.message);
      throw err;
    });
};
