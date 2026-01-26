import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getCart } from "../api/cart.api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CART ================= */
  const reloadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);

      const res = await getCart();

      // Backend returns: List<CartItemResponse>
      const safeItems = Array.isArray(res.data) ? res.data : [];

      setItems(safeItems);
    } catch (err) {
      console.error("Cart load failed:", err);
      // ❗ Keep existing cart state on failure
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /* ================= AUTO LOAD ================= */
  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  /* ================= DERIVED VALUES ================= */
  const cartCount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  /* ================= CONTEXT ================= */
  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        total,
        loading,
        reloadCart,
        setItems, // kept for advanced cases
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};
