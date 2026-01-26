import apiClient from "./apiClient";

/**
 * Paytm Payment Gateway API Integration
 * 
 * Frontend communicates with:
 * 1. /api/paytm/initiate - Get Paytm parameters + checksum
 * 2. /api/paytm/callback - Paytm redirects here with payment result
 * 
 * SECURITY NOTES:
 * - Checksum verification happens ONLY on backend
 * - Merchant key is NEVER exposed to frontend
 * - Never update order/payment status from frontend
 */

/**
 * Initiate Paytm Payment
 * 
 * @param {number} orderId - Order ID to process payment for
 * @returns {Promise} Response with Paytm parameters and checksum
 */
export const initiatePaytmPayment = async (orderId) => {
  return apiClient.post("/api/paytm/initiate", { orderId });
};

/**
 * Get Paytm Gateway URL
 * 
 * @returns {Promise} Response with Paytm Secure Gateway URL
 */
export const getPaytmGatewayUrl = async () => {
  return apiClient.get("/api/paytm/gateway-url");
};

/**
 * Redirect to Paytm Secure Gateway
 * 
 * This function:
 * 1. Gets the Paytm parameters from backend
 * 2. Submits them as a form to Paytm Secure Gateway
 * 3. User completes payment on Paytm
 * 4. Paytm redirects to /api/paytm/callback
 * 
 * @param {number} orderId - Order ID
 */
export const redirectToPaytmGateway = async (orderId) => {
  try {
    // Get Paytm parameters from backend
    const response = await initiatePaytmPayment(orderId);
    const { paytmParams } = response.data;
    const gatewayUrlResponse = await getPaytmGatewayUrl();
    const { gatewayUrl } = gatewayUrlResponse.data;

    // Create a form and submit to Paytm
    const form = document.createElement("form");
    form.method = "POST";
    form.action = gatewayUrl;
    form.target = "_self";  // Submit in same window, not new tab

    // Add all parameters as hidden fields
    for (const [key, value] of Object.entries(paytmParams)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    // Don't remove form after submit as page will navigate

    console.log("[PAYTM] Submitted form to Paytm Secure Gateway");
  } catch (error) {
    console.error("[PAYTM] Error initiating payment:", error);
    throw error;
  }
};
