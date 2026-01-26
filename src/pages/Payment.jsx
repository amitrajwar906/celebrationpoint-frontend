import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { redirectToPaytmGateway } from "../api/paytm.api";
import { QRCodeSVG } from "qrcode.react";
import {
  FiSmartphone,
  FiDownload,
  FiInfo,
} from "react-icons/fi";
import {
  FaGooglePay,
  FaMobileAlt,
  FaWallet,
} from "react-icons/fa";
import { SiPaytm } from "react-icons/si";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const qrCodeRef = useRef(null);

  // UPI Apps List - Only 4 main providers with real icons
  const upiApps = [
    {
      id: "google-pay",
      name: "Google Pay",
      icon: FaGooglePay,
      upi: "googlepay",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "phone-pe",
      name: "PhonePe",
      icon: FaMobileAlt,
      upi: "phonepe",
      color: "from-purple-600 to-purple-700",
    },
    {
      id: "paytm",
      name: "Paytm",
      icon: SiPaytm,
      upi: "paytm",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "bhim",
      name: "BHIM",
      icon: FaWallet,
      upi: "bhim",
      color: "from-orange-500 to-orange-700",
    },
  ];

  // Generate QR Code data (UPI string format)
  const generateUPIString = () => {
    // UPI format: upi://pay?pa=upiid@bank&pn=name&tn=description&am=amount&tr=transactionref
    // For simplicity, using a format that directs to payment with order ID
    return `upi://pay?pa=celebrationpoint@paytm&pn=CelebrationPoint&tn=Order%23${orderId}&tr=ORDER${orderId}`;
  };

  const handleUPIPayment = async (appName) => {
    try {
      setLoading(true);
      console.log(`[UPI] Redirecting to Paytm for ${appName} payment - Order ${orderId}`);
      await redirectToPaytmGateway(orderId);
    } catch (err) {
      console.error("UPI payment error:", err);
      toast.error(
        err.response?.data?.message || `Failed to initiate ${appName} payment`
      );
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `order-${orderId}-qr.png`;
      link.href = url;
      link.click();
      toast.success("QR Code downloaded!");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-card to-card/50 px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <FiSmartphone size={32} className="text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Pay Now</h1>
          </div>

          <p className="text-white/60 mb-2 text-sm md:text-base">
            Order ID: <span className="text-primary font-semibold">#{orderId}</span>
          </p>
          <p className="text-xs md:text-sm text-white/50">
            Scan QR code with any UPI app or select payment method
          </p>
        </div>

        {/* Main Payment Content */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* QR Code Section - Left Side */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-2 w-full">
              <FiInfo size={24} className="text-primary flex-shrink-0" />
              Scan to Pay
            </h2>

            {/* QR Code Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
              <div
                ref={qrCodeRef}
                className="flex items-center justify-center"
              >
                <QRCodeSVG
                  value={generateUPIString()}
                  size={256}
                  level="H"
                  includeMargin={true}
                  className="w-full"
                />
              </div>

              <p className="text-center text-sm text-gray-600 mt-4 font-medium">
                Scan with any UPI app
              </p>

              <button
                onClick={downloadQRCode}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition text-black font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <FiDownload size={18} />
                Download QR
              </button>
            </div>

            {/* Payment Info */}
            <div className="mt-6 md:mt-8 bg-white/5 border border-white/10 rounded-xl p-4 w-full">
              <p className="text-xs md:text-sm text-white/70 text-center">
                💡 <strong>Tip:</strong> Open any UPI app and select "Scan QR Code" option
              </p>
            </div>
          </div>

          {/* UPI Apps Section - Right Side */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
              <FiSmartphone size={24} className="text-primary" />
              Or Pay Directly
            </h2>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {upiApps.map((app) => {
                const IconComponent = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleUPIPayment(app.name)}
                    disabled={loading}
                    className={`group relative p-4 md:p-6 rounded-2xl bg-gradient-to-br ${app.color} shadow-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 overflow-hidden`}
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="mb-2 md:mb-3 transform group-hover:scale-125 transition-transform text-white">
                        <IconComponent size={32} />
                      </div>
                      <h3 className="font-bold text-white text-center text-sm md:text-base">
                        {app.name}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* How to Pay */}
            <div className="mt-6 md:mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FiInfo size={20} className="text-primary flex-shrink-0" />
                How to Pay
              </h3>
              <ol className="space-y-2 text-xs md:text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0 min-w-fit">Option 1:</span>
                  <span>Scan the QR code with any UPI app</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0 min-w-fit">Option 2:</span>
                  <span>Click a payment app above</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0 min-w-fit">Step 1:</span>
                  <span>Enter your UPI PIN to confirm</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0 min-w-fit">Step 2:</span>
                  <span>Confirmation sent to your mobile</span>
                </li>
              </ol>
            </div>

            {/* Security Info */}
            <div className="mt-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-4 md:p-6 text-center">
              <p className="text-xs md:text-sm text-white/70">
                🔒 <span className="font-semibold">256-bit SSL Encryption</span>
              </p>
              <p className="text-xs text-white/50 mt-2">
                Powered by Paytm Payment Gateway
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
