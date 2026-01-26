import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiFileText } from "react-icons/fi";
import { getOrders, getOrderItems } from "../api/order.api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Orders() {
  const navigate = useNavigate();
  const { role, isAuthenticated, loading: authLoading, user } = useAuth();
  const { theme } = useTheme();

  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});
  const [activeTab, setActiveTab] = useState("all"); // "all", "pending", "delivered", "cancelled"

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log("[Orders] 📍 Starting to fetch orders...");
      console.log("[Orders] 👤 User:", user);
      console.log("[Orders] 🔑 Token:", localStorage.getItem("token")?.substring(0, 30) + "...");
      
      const res = await getOrders();
      console.log("[Orders] ✅ API Response:", res);

      // Ensure we have an array of orders
      let orderData = Array.isArray(res.data) ? res.data : [];
      console.log("[Orders] 📦 Loaded orders (before filter):", orderData);
      
      // Filter out PENDING orders (unpaid online payments)
      // Only show orders that are confirmed, paid, or in later stages
      orderData = orderData.filter(order => {
        const isPending = order.status === "PENDING";
        if (isPending) {
          console.log(`[Orders] ⏳ Filtering out PENDING order #${order.id}`);
        }
        return !isPending;
      });
      
      console.log("[Orders] 📦 Loaded orders (after filter):", orderData);
      setOrders(orderData);
    } catch (err) {
      console.error("[Orders] ❌ Error loading orders:", err);
      console.error("[Orders] 📊 Full error object:", JSON.stringify(err, null, 2));
      console.error("[Orders] 🔴 Error response status:", err.response?.status);
      console.error("[Orders] 🔴 Error response headers:", err.response?.headers);
      console.error("[Orders] 🔴 Error response data:", err.response?.data);
      console.error("[Orders] 🔴 Error config URL:", err.config?.url);
      console.error("[Orders] 🔴 Error config method:", err.config?.method);
      console.error("[Orders] 🔴 Error config headers:", err.config?.headers);

      if (err.response?.status === 403) {
        toast.error("Orders are available only for logged-in users");
      } else if (err.response?.status === 401) {
        console.log("[Orders] 🔐 401 Unauthorized - Token invalid or expired");
        toast.error("Session expired. Please login again.");
        // Force logout
        localStorage.removeItem("token");
        window.dispatchEvent(new CustomEvent("logout"));
        navigate("/");
      } else if (err.response?.status === 400) {
        console.error("[Orders] ❌ 400 Bad Request - Backend validation error");
        console.error("[Orders] Backend error message:", err.response?.data?.error || err.response?.data?.message || "Unknown error");
        toast.error("Bad request. Please try logging in again.");
      } else {
        toast.error("Failed to load orders. Please try again later.");
      }

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ORDER ITEMS ================= */
  const toggleItems = async (orderId) => {
    if (expanded === orderId) {
      setExpanded(null);
      return;
    }

    try {
      if (!items[orderId]) {
        setLoadingItems((prev) => ({ ...prev, [orderId]: true }));
        
        const res = await getOrderItems(orderId);
        console.log(`[Orders] 📦 Items API Response for order ${orderId}:`, res);

        // Ensure we have an array of items
        const itemData = Array.isArray(res.data) ? res.data : [];
        console.log(`[Orders] 📋 Loaded items:`, itemData);
        
        setItems((prev) => ({
          ...prev,
          [orderId]: itemData,
        }));
      }

      setExpanded(orderId);
    } catch (err) {
      console.error(`[Orders] ❌ Error loading items for order ${orderId}:`, err);
      console.error("[Orders] Error response:", err.response);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.dispatchEvent(new CustomEvent("logout"));
        navigate("/");
      } else if (err.response?.status === 404) {
        toast.error("Order not found.");
      } else {
        toast.error("Failed to load order items. Please try again.");
      }
      
      setItems((prev) => ({
        ...prev,
        [orderId]: [],
      }));
    } finally {
      setLoadingItems((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    console.log("[Orders] 🔄 useEffect triggered");
    console.log("[Orders] ⏳ Auth Loading:", authLoading);
    console.log("[Orders] ✅ Is Authenticated:", isAuthenticated);
    console.log("[Orders] 👥 User Role:", role);
    console.log("[Orders] 👤 User Object:", user);
    console.log("[Orders] 🔑 Token in localStorage:", !!localStorage.getItem("token"));
    
    if (authLoading) {
      console.log("[Orders] ⏳ Still loading auth state...");
      return;
    }

    if (!isAuthenticated) {
      console.log("[Orders] ❌ User NOT authenticated");
      toast.error("Please login to view your orders");
      navigate("/");
      return;
    }

    if (role === "ROLE_ADMIN") {
      console.log("[Orders] 🚫 User is ADMIN - blocking access to user orders");
      return;
    }

    console.log("[Orders] ✅ User authenticated and is not admin - loading orders");
    loadOrders();
  }, [authLoading, isAuthenticated, role, navigate]);

  /* ================= BLOCK ADMIN ================= */
  if (role === "ROLE_ADMIN") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-red-400">
        Orders page is for users only.  
        Please use Admin → Orders.
      </div>
    );
  }

  /* ================= STATES ================= */
  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-white/60">
        Loading orders...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-white/60">
        Please login to view your orders
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-white/60">
        No orders found
      </div>
    );
  }

  // Filter orders by status
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "pending":
        return orders.filter(o => o.status === "CONFIRMED" || o.status === "PAID" || o.status === "SHIPPED");
      case "delivered":
        return orders.filter(o => o.status === "DELIVERED");
      case "cancelled":
        return orders.filter(o => o.status === "CANCELLED" || o.status === "REFUNDED");
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();
  const pendingCount = orders.filter(o => o.status === "CONFIRMED" || o.status === "PAID" || o.status === "SHIPPED").length;
  const deliveredCount = orders.filter(o => o.status === "DELIVERED").length;
  const cancelledCount = orders.filter(o => o.status === "CANCELLED" || o.status === "REFUNDED").length;

  /* ================= UI ================= */
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className={`text-sm ${
          theme === "light" ? "text-gray-600" : "text-white/60"
        }`}>
          Total: <span className="text-primary font-semibold">{orders.length}</span>
        </p>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 overflow-x-auto pb-2 ${
        theme === "light" ? "border-b border-gray-300" : "border-b border-white/10"
      }`}>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 whitespace-nowrap rounded-t-lg font-medium transition-all ${
            activeTab === "all"
              ? "bg-primary text-black shadow-lg shadow-primary/50"
              : theme === "light"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 whitespace-nowrap rounded-t-lg font-medium transition-all ${
            activeTab === "pending"
              ? "bg-yellow-600 text-white shadow-lg shadow-yellow-600/50"
              : theme === "light"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("delivered")}
          className={`px-6 py-3 whitespace-nowrap rounded-t-lg font-medium transition-all ${
            activeTab === "delivered"
              ? "bg-green-600 text-white shadow-lg shadow-green-600/50"
              : theme === "light"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          Delivered ({deliveredCount})
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`px-6 py-3 whitespace-nowrap rounded-t-lg font-medium transition-all ${
            activeTab === "cancelled"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
              : theme === "light"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${
            theme === "light" ? "text-gray-600" : "text-white/60"
          }`}>
            {activeTab === "all"
              ? "No orders found"
              : activeTab === "pending"
              ? "No pending orders"
              : activeTab === "delivered"
              ? "No delivered orders"
              : "No cancelled orders"}
          </p>
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.map((o) => (
        <div
          key={o.id}
          className={`rounded-2xl p-5 space-y-4 ${
            theme === "light"
              ? "bg-white border border-gray-200"
              : "bg-card border border-white/10"
          }`}
        >
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-lg">
                Order #{o.id}
              </p>
              <p className={`text-sm ${
                theme === "light" ? "text-gray-600" : "text-white/60"
              }`}>
                Status: <span className="text-primary">{o.status}</span>
              </p>
              {o.createdAt && (
                <p className={`text-xs ${
                  theme === "light" ? "text-gray-500" : "text-white/40"
                }`}>
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="font-semibold text-lg">
                ₹{parseFloat(o.totalAmount).toFixed(2)}
              </p>

              {(o.status === "PAID" || o.status === "DELIVERED") && (
                <Link
                  to={`/invoice/${o.id}`}
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-primary shadow-glow hover:shadow-glow-lg transition-shadow"
                >
                  <FiFileText size={18} />
                  Invoice
                </Link>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleItems(o.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300 text-black"
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
            disabled={loadingItems[o.id]}
          >
            {loadingItems[o.id] ? "Loading..." : expanded === o.id ? "Hide Items" : "View Items"}
          </button>

          {expanded === o.id && (
            <div className={`border-t pt-4 space-y-2 ${
              theme === "light" ? "border-gray-200" : "border-white/10"
            }`}>
              {(!items[o.id] || items[o.id].length === 0) && (
                <p className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-white/50"
                }`}>
                  No items found for this order
                </p>
              )}

              {items[o.id]?.map((i) => (
                <div
                  key={`${o.id}-${i.productId}`}
                  className={`flex justify-between text-sm px-2 py-1 rounded ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-white/5 text-white/70"
                  }`}
                >
                  <span>
                    {i.productName} × {i.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{parseFloat(i.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
