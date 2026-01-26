import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

/**
 * Paytm Callback Handler Page
 * 
 * This page receives the callback from Paytm after payment.
 * The backend (/api/paytm/callback) handles the actual status update.
 * 
 * Flow:
 * 1. Paytm POSTs to /api/paytm/callback
 * 2. Backend verifies checksum and updates order/payment status
 * 3. Backend redirects to /paytm-callback?status=SUCCESS&orderId=X
 * 4. This component displays result and redirects to /orders
 */
export default function PaytmCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackStatus = params.get("status");
    const orderIdParam = params.get("orderId");

    setStatus(callbackStatus || "UNKNOWN");
    setOrderId(orderIdParam);

    // Log for debugging
    console.log("[PAYTM CALLBACK]", {
      status: callbackStatus,
      orderId: orderIdParam,
      timestamp: new Date().toISOString(),
    });

    if (callbackStatus === "SUCCESS") {
      toast.success("Payment successful! Redirecting to orders...");
      // Redirect to orders after 2 seconds
      const timer = setTimeout(() => {
        navigate("/orders");
      }, 2000);
      return () => clearTimeout(timer);
    } else if (callbackStatus === "FAILED") {
      toast.error("Payment failed. Please try again.");
      // Redirect to payment page after 3 seconds
      const timer = setTimeout(() => {
        navigate(`/payment/${orderIdParam}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">
        {status === "SUCCESS"
          ? "✓ Payment Successful"
          : status === "FAILED"
          ? "✗ Payment Failed"
          : "Processing Payment..."}
      </h1>

      {orderId && (
        <p className="text-white/60 mb-6">
          Order ID: #{orderId}
        </p>
      )}

      <div className="flex justify-center">
        {status === "processing" && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        )}
      </div>

      {status === "SUCCESS" && (
        <p className="text-white/80 mt-6">
          Redirecting to orders page...
        </p>
      )}

      {status === "FAILED" && (
        <p className="text-white/80 mt-6">
          Redirecting to payment page...
        </p>
      )}
    </section>
  );
}
