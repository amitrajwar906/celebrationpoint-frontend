import { useState, useEffect } from "react";
import {
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
} from "react-icons/fi";


import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  updateCartItem,
  removeCartItem,
} from "../api/cart.api";
import { getProductById } from "../api/product.api";

import EmptyState from "../components/EmptyState";
import { CartItemSkeleton } from "../components/Skeleton";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export default function Cart() {
  const { items, total, reloadCart, loading } = useCart();
  const { theme } = useTheme();
  const [updatingId, setUpdatingId] = useState(null);
  const [productStocks, setProductStocks] = useState({});

  // Fetch product stock info for cart items
  useEffect(() => {
    const fetchProductStocks = async () => {
      try {
        const stocks = {};
        for (const item of items) {
          if (!stocks[item.productId]) {
            const res = await getProductById(item.productId);
            const product = res.data;
            stocks[item.productId] = product.quantity || product.stock || product.stockQuantity || 0;
          }
        }
        setProductStocks(stocks);
      } catch (err) {
        console.error("Failed to fetch product stocks", err);
      }
    };

    if (items.length > 0) {
      fetchProductStocks();
    }
  }, [items]);

  /* ================= UPDATE QTY ================= */
  const changeQty = async (cartItemId, newQty, productId) => {
    if (newQty < 1) return;

    // Check against product stock
    const availableStock = productStocks[productId] || 0;
    if (newQty > availableStock) {
      toast.error(`Oops sorry no more quantity of this product. Only ${availableStock} available`);
      return;
    }

    try {
      setUpdatingId(cartItemId);
      await updateCartItem(cartItemId, newQty);
      await reloadCart();
      toast.success("Quantity updated");
    } catch (err) {
      // Check if error is due to stock limit from backend
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.status === 400) {
        toast.error("Oops sorry quantity is not available, try again after some time");
      } else {
        toast.error("Failed to update cart");
      }
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= REMOVE ================= */
  const removeItem = async (cartItemId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      setUpdatingId(cartItemId);
      await removeCartItem(cartItemId);
      await reloadCart();
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        {[...Array(4)].map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </section>
    );
  }

  /* ================= EMPTY ================= */
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some celebration items to continue."
        actionText="Browse Products"
        actionLink="/products"
      />
    );
  }

  /* ================= UI ================= */
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl p-4 md:p-6 ${
              theme === "light"
                ? "bg-white border border-gray-200"
                : "bg-card border border-white/10"
            }`}
          >
            {/* Left: Product Info + Image */}
            <Link to={`/product/${item.productId}`} className="flex gap-4 flex-1 md:items-center hover:opacity-80 transition">
              {/* Product Image */}
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 ${
                theme === "light"
                  ? "bg-gray-100 border border-gray-300"
                  : "bg-white/5 border border-white/10"
              }`}>
                {item.productImage || item.imageUrl ? (
                  <img
                    src={item.productImage || item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  style={{ display: item.productImage || item.imageUrl ? "none" : "flex" }}
                  className={`w-full h-full flex items-center justify-center ${
                    theme === "light" ? "bg-gray-200" : "bg-white/5"
                  }`}
                >
                  <FiShoppingBag className={theme === "light" ? "text-gray-400" : "text-white/30"} size={32} />
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg hover:text-primary transition">
                  {item.productName}
                </h3>
                <p className="text-primary font-bold text-lg">
                  ₹{item.price}
                </p>
                <p className={`text-xs mt-1 ${
                  theme === "light" ? "text-gray-600" : "text-white/50"
                }`}>
                  Qty: {item.quantity} × ₹{item.price} = ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </Link>

            {/* Right: Quantity Controls + Remove */}
            <div className="flex items-center gap-3 justify-between md:justify-end md:flex-shrink-0">
              <button
                onClick={() =>
                  changeQty(item.cartItemId, item.quantity - 1, item.productId)
                }
                disabled={updatingId === item.cartItemId}
                className={`p-2 rounded-lg ${
                  theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <FiMinus />
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  changeQty(item.cartItemId, item.quantity + 1, item.productId)
                }
                disabled={updatingId === item.cartItemId}
                className={`p-2 rounded-lg ${
                  theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <FiPlus />
              </button>

              <button
                onClick={() => removeItem(item.cartItemId)}
                disabled={updatingId === item.cartItemId}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-xl font-semibold">
          Total: <span className="text-primary">₹{total}</span>
        </div>

        <Link
          to="/checkout"
          className="px-8 py-3 rounded-xl bg-primary shadow-glow"
        >
          <FiShoppingBag />
          Checkout
        </Link>
      </div>
    </section>
  );
}
