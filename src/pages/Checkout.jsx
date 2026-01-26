import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createCheckout } from "../api/checkout.api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { reloadCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    shippingAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const submit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (
      !form.fullName ||
      !form.phone ||
      !form.addressLine ||
      !form.shippingAddress ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error("All fields are required");
      console.warn("[CHECKOUT] Validation failed - missing fields:", {
        fullName: !!form.fullName,
        phone: !!form.phone,
        addressLine: !!form.addressLine,
        shippingAddress: !!form.shippingAddress,
        city: !!form.city,
        state: !!form.state,
        pincode: !!form.pincode,
      });
      return;
    }

    // Validate payment method is selected
    if (!paymentMethod) {
      toast.error("Please select a payment method (COD or Paytm)");
      console.warn("[CHECKOUT] Validation failed - no payment method selected");
      return;
    }

    try {
      setLoading(true);
      const checkoutData = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine: form.addressLine,
        shippingAddress: form.shippingAddress,
        city: form.city,
        state: form.state,
        postalCode: form.pincode,
        paymentMethod: paymentMethod,  // Use selected payment method
      };
      
      console.log("[CHECKOUT] Sending checkout data:", JSON.stringify(checkoutData, null, 2));
      const res = await createCheckout(checkoutData);

      console.log("[CHECKOUT] Order created successfully:", JSON.stringify(res.data, null, 2));

      // Clear cart after successful order (non-blocking - don't await)
      try {
        await reloadCart();
        console.log("[CHECKOUT] ✅ Cart cleared after order");
      } catch (cartErr) {
        console.warn("[CHECKOUT] ⚠️ Cart clear failed, but order succeeded:", cartErr);
      }

      toast.success("Order created successfully");

      // Handle different payment methods
      if (paymentMethod === "COD") {
        // COD: Direct redirect to orders
        console.log("[CHECKOUT] 💳 COD selected - Order created with CONFIRMED status");
        navigate("/orders");
      } else if (paymentMethod === "PAYTM") {
        // Paytm: Redirect to payment page for Paytm initialization
        console.log("[CHECKOUT] 💳 PAYTM selected - Order created with PENDING status, redirecting to payment");
        navigate(`/payment/${res.data.orderId}`);
      }
    } catch (err) {
      console.error("[CHECKOUT] ❌ Checkout failed:", err.message);
      const errorData = err.response?.data;
      const statusCode = err.response?.status;
      
      console.error("[CHECKOUT] ❌ HTTP Status:", statusCode);
      console.error("[CHECKOUT] ❌ Full error response:", JSON.stringify(errorData, null, 2));
      console.error("[CHECKOUT] ❌ Error details:", {
        message: err.message,
        status: statusCode,
        data: errorData,
      });
      
      let errorMsg = "Checkout failed";
      
      // Handle different error types
      if (statusCode === 401) {
        errorMsg = "⚠️ Not authenticated - Please login again";
        console.error("[CHECKOUT] ⚠️ 401 UNAUTHORIZED - JWT token invalid or expired");
      } else if (statusCode === 400) {
        errorMsg = "Invalid request - Check all fields are filled";
        console.error("[CHECKOUT] ⚠️ 400 BAD REQUEST - Missing or invalid fields");
      } else if (statusCode === 500) {
        errorMsg = "Server error - Please try again later";
        console.error("[CHECKOUT] ⚠️ 500 SERVER ERROR");
      } else if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      } else if (errorData?.error) {
        errorMsg = errorData.error;
      }
      
      console.error("[CHECKOUT] ✅ Final error message to show user:", errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form
        onSubmit={submit}
        className="space-y-6"
      >
        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "fullName", label: "Full Name" },
            { key: "phone", label: "Phone" },
            { key: "addressLine", label: "Address Line 1" },
            { key: "shippingAddress", label: "Address Line 2 / Shipping Details" },
            { key: "city", label: "City" },
            { key: "state", label: "State" },
            { key: "pincode", label: "Pincode" },
          ].map((f) => (
            <input
              key={f.key}
              placeholder={f.label}
              className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-primary"
              value={form[f.key]}
              onChange={(e) =>
                setForm({ ...form, [f.key]: e.target.value })
              }
            />
          ))}
        </div>

        {/* Payment Method Selection */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="ml-3">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="PAYTM"
                checked={paymentMethod === "PAYTM"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="ml-3">Paytm</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl bg-primary shadow-glow hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </section>
  );
}
