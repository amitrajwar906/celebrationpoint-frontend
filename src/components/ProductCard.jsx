import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../api/cart.api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function ProductCard({ product }) {
  const { reloadCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Get quantity from any possible field name
  const getQuantity = () => {
    return (
      product?.quantity ||
      product?.stock ||
      product?.stockQuantity ||
      product?.available_quantity ||
      product?.availableQuantity ||
      product?.availableQty ||
      product?.qty ||
      0
    );
  };

  const qty = getQuantity();

  useEffect(() => {
    console.log("Product Data:", product);
    console.log("Detected Quantity:", qty);
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!qty || qty === 0) {
      toast.error("Sorry, this item is out of stock");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
      await reloadCart();
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className={`group rounded-2xl transition flex flex-col p-4 ${
      theme === "light"
        ? "bg-white border border-gray-200 text-black hover:shadow-md"
        : "bg-card border border-white/10 text-white hover:border-primary"
    }`}>
      {/* Image - Clickable Link */}
      <Link to={`/product/${product.id}`} className={`aspect-square rounded-xl mb-4 overflow-hidden block ${
        theme === "light" ? "bg-gray-200" : "bg-black/40"
      }`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-sm ${
            theme === "light" ? "text-gray-500" : "text-white/40"
          }`}>
            No Image
          </div>
        )}
      </Link>

      {/* Info - Clickable Link */}
      <Link to={`/product/${product.id}`} className="block mb-2">
        <h3 className={`font-semibold line-clamp-1 hover:opacity-80 transition ${
          theme === "light" ? "text-black" : "text-white"
        }`}>
          {product.name}
        </h3>
      </Link>

      <p className={`text-sm mb-2 line-clamp-2 ${
        theme === "light" ? "text-gray-600" : "text-white/60"
      }`}>
        {product.description || "Premium celebration product"}
      </p>

      {/* Price & Quantity */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ₹{product.price}
          </span>
          {qty > 0 ? (
            <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
              theme === "light"
                ? "bg-green-100 text-green-700"
                : "bg-green-500/20 text-green-400"
            }`}>
              {qty} left
            </span>
          ) : (
            <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
              theme === "light"
                ? "bg-red-100 text-red-700"
                : "bg-red-500/20 text-red-400"
            }`}>
              Out of Stock
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!qty || qty === 0}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
            qty > 0
              ? "bg-primary/90 hover:bg-primary cursor-pointer"
              : "bg-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          <FiShoppingCart />
          {qty > 0 ? "Add" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
