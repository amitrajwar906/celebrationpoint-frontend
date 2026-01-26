import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";
import { OrderSkeleton } from "../../components/Skeleton";

import {
  getAllOrders,
  updateOrderStatus,
  cancelOrderByAdmin,
  getAdminOrderItems,
} from "../api/admin.orders.api";

const TABS = {
  PENDING: "PENDING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.PENDING);
  const [itemsMap, setItemsMap] = useState({}); // Track items for each order
  const [searchId, setSearchId] = useState(""); // Search by order ID

  /* ================= LOAD ================= */
  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      console.log("[ADMIN] Loading all orders");
      const res = await getAllOrders();
      console.log("[ADMIN] Orders loaded:", res.data);
      setOrders(Array.isArray(res.data) ? res.data : []);
      
      // Fetch items for each order
      if (Array.isArray(res.data)) {
        const newItemsMap = {};
        for (const order of res.data) {
          try {
            console.log(`[ADMIN] Fetching items for order ${order.id}`);
            const itemsRes = await getAdminOrderItems(order.id);
            console.log(`[ADMIN] Items for order ${order.id}:`, itemsRes.data);
            newItemsMap[order.id] = Array.isArray(itemsRes.data) ? itemsRes.data : [];
          } catch (err) {
            console.error(`[ADMIN] Failed to load items for order ${order.id}:`, err);
            newItemsMap[order.id] = [];
          }
        }
        console.log("[ADMIN] Items map:", newItemsMap);
        setItemsMap(newItemsMap);
      }
    } catch (err) {
      console.error("[ADMIN] Failed to load orders:", err);
      console.error("[ADMIN] Error response:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= FILTERS ================= */
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"),
    [orders]
  );

  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === "DELIVERED"),
    [orders]
  );

  const cancelledOrders = useMemo(
    () => orders.filter((o) => o.status === "CANCELLED"),
    [orders]
  );

  const tabOrders = 
    activeTab === TABS.PENDING ? pendingOrders :
    activeTab === TABS.DELIVERED ? deliveredOrders :
    cancelledOrders;

  // Filter by search ID if provided
  const visibleOrders = useMemo(
    () => searchId.trim() 
      ? tabOrders.filter((o) => o.id.toString().includes(searchId.trim()))
      : tabOrders,
    [tabOrders, searchId]
  );

  /* ================= ACTIONS ================= */
  const changeStatus = async (orderId, status) => {
    try {
      console.log(`[ADMIN] Updating order ${orderId} status to ${status}`);
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      loadOrders();
    } catch (err) {
      console.error(`[ADMIN] Failed to update order ${orderId}:`, err);
      console.error("[ADMIN] Error response:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to update order status");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      console.log(`[ADMIN] Cancelling order ${orderId}`);
      await cancelOrderByAdmin(orderId);
      toast.success("Order cancelled");
      loadOrders();
    } catch (err) {
      console.error(`[ADMIN] Failed to cancel order ${orderId}:`, err);
      console.error("[ADMIN] Error response:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Orders</h1>

          <button
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-fit"
          >
            <FiRefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/5">
              Pending:{" "}
              <span className="text-primary font-semibold">
                {pendingOrders.length}
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/5">
              Delivered:{" "}
              <span className="text-green-400 font-semibold">
                {deliveredOrders.length}
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/5">
              Cancelled:{" "}
              <span className="text-red-400 font-semibold">
                {cancelledOrders.length}
              </span>
            </div>
          </div>
        </div>

        {/* ================= SEARCH BY ORDER ID ================= */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-primary focus:outline-none flex-1 md:flex-none"
          />
          {searchId && (
            <button
              onClick={() => setSearchId("")}
              className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* ================= SEARCH RESULTS INFO ================= */}
        {searchId && (
          <p className="text-sm text-white/60">
            Found {visibleOrders.length} order{visibleOrders.length !== 1 ? "s" : ""} matching ID "{searchId}"
          </p>
        )}
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-3">
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === tab
                ? "bg-primary text-black shadow-glow"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : visibleOrders.length === 0 ? (
        <p className="text-white/60">
          {searchId 
            ? `No orders found with ID "${searchId}"`
            : `No ${activeTab.toLowerCase()} orders`
          }
        </p>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-white/10 p-6 space-y-4 bg-card"
            >
              {/* TOP */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  Order #{order.id}
                </h2>

                <span className="px-3 py-1 rounded-full bg-white/5 text-sm">
                  {order.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
                <div>
                  <p>User: {order.user?.fullName || "N/A"}</p>
                  <p>Email: {order.user?.email || "N/A"}</p>
                  <p>Phone: {order.phone || "N/A"}</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">Delivery Address</p>
                  <p>{order.fullName}</p>
                  <p>{order.addressLine}</p>
                  <p>{order.city}, {order.state} - {order.postalCode}</p>
                  <p>Pincode: {order.pincode}</p>
                </div>
              </div>

              {/* ITEMS */}
              <div>
                <p className="font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {itemsMap[order.id]?.length > 0 ? (
                    itemsMap[order.id].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm bg-white/5 rounded-lg px-3 py-2"
                      >
                        <span>
                          {item.productName} × {item.quantity}
                        </span>
                        <span>₹{item.price}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50 text-sm">No items</p>
                  )}
                </div>
              </div>

              {/* TOTAL */}
              <div className="text-right font-semibold">
                Total: ₹{order.totalAmount}
              </div>

              {/* ACTIONS (ONLY PENDING TAB) */}
              {activeTab === TABS.PENDING && (
                <div className="flex flex-wrap gap-3 pt-4">
                  {/* STATUS DROPDOWN */}
                  <select
                    value={order.status}
                    onChange={(e) => changeStatus(order.id, e.target.value)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 focus:border-primary focus:outline-none"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status} className="bg-gray-900">
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      changeStatus(order.id, "SHIPPED")
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400"
                  >
                    <FiTruck />
                    Mark Shipped
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(order.id, "DELIVERED")
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400"
                  >
                    <FiCheckCircle />
                    Confirm Delivered
                  </button>

                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400"
                  >
                    <FiXCircle />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
