import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { getOrderItems } from "../api/order.api";

function fmt(v) {
  const n = parseFloat(v || 0);
  if (Number.isNaN(n)) return "₹0.00";
  return `₹${n.toFixed(2)}`;
}

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const order = state?.order || null;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Redirect if no order in state
    if (!order) {
      navigate("/orders", { replace: true });
      return;
    }

    // small entrance animation
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [order, navigate]);

  // Normalize items array from possible API shapes
  const items = useMemo(() => {
    if (!order) return [];
    return (
      order.items || order.orderItems || order.itemsList || order.itemsDto || []
    ).map((it) => {
      // support different api shapes
      return {
        id: it.id ?? it.productId ?? it.product?.id,
        name: it.name ?? it.productName ?? it.product?.name,
        image: it.imageUrl ?? it.product?.imageUrl ?? it.product?.image ?? it.image,
        price: parseFloat(it.price ?? it.unitPrice ?? it.product?.price ?? 0),
        quantity: parseInt(it.quantity ?? it.qty ?? it.count ?? 1, 10) || 1,
      };
    });
  }, [order]);

  // If the checkout response didn't include items, fetch them from API
  const [fetchedItems, setFetchedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    let mounted = true;
    const id = order?.orderId ?? order?.id ?? order?.reference;
    // Only fetch if we have an order id and no items in the passed order
    const hasItemsInState = (order && (order.items || order.orderItems || order.itemsList || (order.itemsDto && order.itemsDto.length > 0)));
    if (!id || hasItemsInState) return;

    setLoadingItems(true);
    getOrderItems(id)
      .then((res) => {
        if (!mounted) return;
        const arr = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        const mapped = arr.map((it) => ({
          id: it.id ?? it.productId ?? it.product?.id,
          name: it.productName ?? it.name ?? it.product?.name,
          image: it.imageUrl ?? it.product?.imageUrl ?? it.product?.image ?? it.image,
          price: parseFloat(it.price ?? it.unitPrice ?? it.product?.price ?? 0),
          quantity: parseInt(it.quantity ?? it.qty ?? it.count ?? 1, 10) || 1,
        }));
        setFetchedItems(mapped);
      })
      .catch((err) => {
        console.error("[OrderSuccess] Failed to fetch order items:", err);
      })
      .finally(() => setLoadingItems(false));

    return () => {
      mounted = false;
    };
  }, [order]);

  // Final items list: prefer items from order state, fallback to fetchedItems
  const finalItems = useMemo(() => {
    if (items && items.length > 0) return items;
    return fetchedItems || [];
  }, [items, fetchedItems]);

  const itemsTotal = useMemo(() => {
    return finalItems.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
  }, [finalItems]);

  const deliveryFee = parseFloat(order?.deliveryFee ?? order?.shippingCharge ?? 0) || 0;
  const tax = parseFloat(order?.tax ?? 0) || 0;
  const grandTotal = parseFloat(order?.totalAmount ?? order?.grandTotal ?? itemsTotal + deliveryFee + tax) || 0;

  const orderId = order?.orderId ?? order?.id ?? order?.reference ?? "—";
  const createdAt = order?.createdAt || order?.createdAt || order?.createdOn || order?.timestamp;
  const status = order?.status ?? order?.orderStatus ?? "CONFIRMED";
  const paymentMethod = order?.paymentMethod ?? order?.payment ?? order?.paymentType ?? "—";

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div
        className={`max-w-3xl mx-auto text-center space-y-6 transform transition-all duration-500 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="mx-auto w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 shadow-glow">
          <FiCheckCircle size={72} className="text-black" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold">Order Placed Successfully</h1>
        <p className={`max-w-xl mx-auto ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
          Thank you for your purchase! We are processing your order and will send updates to your account and email.
        </p>

        {/* Main content card */}
        <div className={`mt-6 rounded-2xl p-6 grid gap-6 md:grid-cols-2 ${
          theme === "light" ? "bg-white border border-gray-200" : "bg-card border border-white/10"
        }`}>
          {/* Left: Order details & items */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/40">Order ID</p>
                <p className="font-semibold">#{orderId}</p>
                {createdAt && (
                  <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-500" : "text-white/40"}`}>
                    {new Date(createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm text-white/40">Status</p>
                <p className="font-semibold text-primary">{status}</p>
                <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-500" : "text-white/40"}`}>
                  {paymentMethod}
                </p>
              </div>
            </div>

            <div className={`pt-3 border-t ${theme === "light" ? "border-gray-100" : "border-white/10"}`}>
              <h3 className="font-semibold mb-3">Items</h3>

              <div className="space-y-3">
                {(!finalItems || finalItems.length === 0) && !loadingItems && (
                  <div className={`py-6 text-center rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-white/5"}`}>
                    <p className={theme === "light" ? "text-gray-600" : "text-white/60"}>No item details available. View your orders for full details.</p>
                  </div>
                )}

                {loadingItems && (
                  <div className={`py-6 text-center rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-white/5"}`}>
                    <p className={theme === "light" ? "text-gray-600" : "text-white/60"}>Loading items...</p>
                  </div>
                )}

                {finalItems.map((it) => (
                  <div key={it.id || it.name} className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${theme === "light" ? "bg-gray-100" : "bg-white/5"}`}>
                      {it.image ? (
                        <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-sm ${theme === "light" ? "text-gray-500" : "text-white/40"}`}>
                          Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{it.name}</p>
                          <p className={`text-sm mt-1 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>Qty × {it.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{fmt(it.price)}</p>
                          <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-white/40"}`}>Subtotal {fmt(it.price * it.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Price summary */}
          <div className="rounded-xl p-5 shadow-md self-start" style={{background: theme === 'light' ? undefined : undefined}}>
            <h3 className="font-semibold mb-4">Price Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className={theme === "light" ? "text-gray-600" : "text-white/60"}>Items total</span>
                <span className="font-medium">{fmt(itemsTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === "light" ? "text-gray-600" : "text-white/60"}>Delivery fee</span>
                <span className="font-medium">{fmt(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === "light" ? "text-gray-600" : "text-white/60"}>Tax</span>
                <span className="font-medium">{fmt(tax)}</span>
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between items-center">
                <div>
                  <p className={theme === "light" ? "text-gray-600 text-sm" : "text-white/60 text-sm"}>Grand total</p>
                  <p className="text-xs text-white/40">(including taxes & fees)</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{fmt(grandTotal)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 flex-col sm:flex-row">
              <Link to="/orders" className={`w-full text-center px-4 py-3 rounded-lg font-medium transition ${
                theme === "light" ? "bg-gray-200 text-black hover:bg-gray-300" : "bg-white/10 text-white hover:bg-white/15"
              }`}>
                Go to My Orders
              </Link>

              <Link to="/products" className="w-full text-center px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-black font-semibold hover:shadow-glow">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
