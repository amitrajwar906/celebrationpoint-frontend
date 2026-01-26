import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft, FiCheck, FiX, FiTruck, FiShield } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { getProductById, getProductsByCategory } from "../api/product.api";
import { addToCart } from "../api/cart.api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { ProductSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { reloadCart } = useCart();
  const { theme } = useTheme();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addingRelated, setAddingRelated] = useState(null);

  // Get quantity from any possible field name
  const getQuantity = () => {
    if (!product) return 0;
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

  // Handle add to cart for main product
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
      setAdding(true);
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
      await reloadCart();
      toast.success("Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  // Load product details and related products
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productRes = await getProductById(id);
        const productData = productRes.data;
        console.log("Product data:", productData);
        setProduct(productData);

        // Fetch related products by category
        let categoryId = productData.categoryId || productData.category?.id;
        console.log("Raw Category ID:", categoryId, "Type:", typeof categoryId);
        
        // Ensure categoryId is a number
        if (categoryId) {
          categoryId = parseInt(categoryId, 10);
          console.log("Converted Category ID:", categoryId);

          try {
            const relatedRes = await getProductsByCategory(categoryId);
            console.log("Related products response:", relatedRes);
            console.log("Related products data:", relatedRes.data);
            
            // Backend returns array directly or wrapped in data property
            let relatedData = Array.isArray(relatedRes.data) 
              ? relatedRes.data 
              : Array.isArray(relatedRes.data?.data)
              ? relatedRes.data.data
              : [];
            
            console.log("Related data array:", relatedData);
            
            // Filter out current product from related products
            const currentProductId = parseInt(id, 10);
            const related = relatedData.filter((p) => parseInt(p.id, 10) !== currentProductId);
            
            console.log("Filtered related products:", related);
            setRelatedProducts(related.slice(0, 4)); // Show max 4 related products
          } catch (categoryErr) {
            console.error("Failed to load related products:", categoryErr);
            setRelatedProducts([]);
          }
        } else {
          console.log("No category ID found for product");
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // Handle add to cart for related products
  const handleAddRelatedToCart = async (productId, relatedQty) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!relatedQty || relatedQty === 0) {
      toast.error("Sorry, this item is out of stock");
      return;
    }

    try {
      setAddingRelated(productId);
      await addToCart({
        productId,
        quantity: 1,
      });
      await reloadCart();
      toast.success("Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingRelated(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className={`min-h-screen ${
        theme === "light" ? "bg-white" : "bg-black"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition ${
              theme === "light"
                ? "text-gray-700 hover:bg-gray-200"
                : "text-white hover:bg-white/10"
            }`}
          >
            <FiArrowLeft size={20} />
            Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className={`h-96 sm:h-[500px] rounded-2xl animate-pulse ${
              theme === "light" ? "bg-gray-200" : "bg-white/5"
            }`} />
            <div className="space-y-4">
              <div className={`h-10 rounded animate-pulse ${
                theme === "light" ? "bg-gray-200" : "bg-white/5"
              }`} />
              <div className={`h-6 w-48 rounded animate-pulse ${
                theme === "light" ? "bg-gray-200" : "bg-white/5"
              }`} />
              <div className={`h-4 rounded animate-pulse ${
                theme === "light" ? "bg-gray-200" : "bg-white/5"
              }`} />
              <div className={`h-12 rounded animate-pulse ${
                theme === "light" ? "bg-gray-200" : "bg-white/5"
              }`} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Product not found
  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="The product you're looking for doesn't exist or has been removed."
        actionText="Browse Products"
        actionLink="/products"
      />
    );
  }

  return (
    <section className={`min-h-screen ${
      theme === "light" ? "bg-gradient-to-br from-white to-gray-50" : "bg-gradient-to-br from-black to-[#0a0a0a]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition ${
            theme === "light"
              ? "text-gray-700 hover:bg-gray-200"
              : "text-white hover:bg-white/10"
          }`}
        >
          <FiArrowLeft size={20} />
          Back
        </button>

        {/* Product Details - Premium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Product Image - Premium */}
          <div className={`rounded-3xl overflow-hidden flex items-center justify-center h-96 sm:h-[500px] md:h-[600px] shadow-2xl ${
            theme === "light" 
              ? "bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300" 
              : "bg-gradient-to-br from-white/5 to-white/10 border border-white/20"
          }`}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`flex flex-col items-center justify-center text-center gap-3 ${
                theme === "light" ? "text-gray-500" : "text-white/40"
              }`}>
                <div className="text-6xl">🖼️</div>
                <p className="text-lg font-semibold">No Image</p>
                <p className="text-sm opacity-70">Image not available</p>
              </div>
            )}
          </div>

          {/* Product Info - Premium */}
          <div className="space-y-6 flex flex-col justify-center">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-flex w-max">
                <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide ${
                  theme === "light"
                    ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700"
                    : "bg-gradient-to-r from-primary/20 to-primary/10 text-primary"
                }`}>
                  {product.category.name || product.category}
                </span>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-3 ${
                theme === "light" 
                  ? "text-black" 
                  : "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
              }`}>
                {product.name}
              </h1>
            </div>

            {/* Description */}
            {product.description && (
              <p className={`text-lg leading-relaxed ${
                theme === "light" ? "text-gray-600" : "text-white/70"
              }`}>
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div className={`h-px ${theme === "light" ? "bg-gray-300" : "bg-white/10"}`} />

            {/* Price Section */}
            <div className="space-y-3">
              <p className={`text-sm font-semibold tracking-widest uppercase ${
                theme === "light" ? "text-gray-600" : "text-white/60"
              }`}>
                Price
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-bold text-primary">
                  ₹{parseFloat(product.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Stock Status - Premium Badge */}
            <div className="space-y-2">
              {qty > 0 ? (
                <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${
                  theme === "light"
                    ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200"
                    : "bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-400 border border-green-500/30"
                }`}>
                  <FiCheck size={20} />
                  <span>{qty} {qty === 1 ? "item" : "items"} in stock</span>
                </div>
              ) : (
                <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold ${
                  theme === "light"
                    ? "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200"
                    : "bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-400 border border-red-500/30"
                }`}>
                  <FiX size={20} />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button - Premium */}
            <button
              onClick={handleAddToCart}
              disabled={!qty || qty === 0 || adding}
              className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 active:scale-95 w-full ${
                qty > 0 && !adding
                  ? "bg-gradient-to-r from-primary to-red-500 hover:shadow-2xl hover:shadow-primary/50 text-white cursor-pointer"
                  : "bg-gray-400 text-white cursor-not-allowed opacity-50"
              }`}
            >
              <FiShoppingCart size={24} />
              <span>{adding ? "Adding to Cart..." : qty > 0 ? "Add to Cart" : "Out of Stock"}</span>
            </button>

            {/* Features */}
            <div className={`space-y-3 pt-4 border-t ${theme === "light" ? "border-gray-300" : "border-white/10"}`}>
              <div className="flex items-start gap-3">
                <FiTruck className={`text-lg mt-1 flex-shrink-0 ${
                  theme === "light" ? "text-blue-600" : "text-primary"
                }`} />
                <p className={`text-sm font-medium ${
                  theme === "light" ? "text-gray-700" : "text-white/80"
                }`}>
                  Fast & Reliable Delivery
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FiShield className={`text-lg mt-1 flex-shrink-0 ${
                  theme === "light" ? "text-blue-600" : "text-primary"
                }`} />
                <p className={`text-sm font-medium ${
                  theme === "light" ? "text-gray-700" : "text-white/80"
                }`}>
                  Premium Quality Guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${
                theme === "light" ? "text-black" : "text-white"
              }`}>
                Related Products
              </h2>
              <p className={`text-sm font-medium ${
                theme === "light" ? "text-gray-600" : "text-white/60"
              }`}>
                More celebrations from {product.category?.name}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {relatedProducts.map((p) => {
                const relatedQty = p?.quantity || p?.stock || p?.stockQuantity || 0;
                return (
                  <div
                    key={p.id}
                    className={`group rounded-2xl p-4 hover:shadow-xl transition overflow-hidden flex flex-col ${
                      theme === "light"
                        ? "bg-white border border-gray-200 hover:border-primary"
                        : "bg-card border border-white/10 hover:border-primary/50"
                    }`}
                  >
                    {/* Image - Clickable */}
                    <Link to={`/product/${p.id}`} className={`aspect-square rounded-xl mb-4 overflow-hidden flex items-center justify-center group-hover:scale-105 transition ${
                      theme === "light" ? "bg-gray-100" : "bg-black/40"
                    }`}>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`text-3xl opacity-30`}>
                          🎉
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <Link to={`/product/${p.id}`} className="block mb-2">
                      <h3 className={`font-semibold line-clamp-2 hover:text-primary transition text-sm sm:text-base ${
                        theme === "light" ? "text-black" : "text-white"
                      }`}>
                        {p.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <p className="text-primary font-bold mb-3 text-sm sm:text-base">
                      ₹{parseFloat(p.price).toFixed(2)}
                    </p>

                    {/* Stock Badge */}
                    <div className="mb-3">
                      {relatedQty > 0 ? (
                        <span className={`text-xs font-semibold px-2 py-1 rounded inline-block ${
                          theme === "light"
                            ? "bg-green-100 text-green-700"
                            : "bg-green-500/20 text-green-400"
                        }`}>
                          {relatedQty} left
                        </span>
                      ) : (
                        <span className={`text-xs font-semibold px-2 py-1 rounded inline-block ${
                          theme === "light"
                            ? "bg-red-100 text-red-700"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={() => handleAddRelatedToCart(p.id, relatedQty)}
                      disabled={!relatedQty || addingRelated === p.id}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition font-medium text-sm ${
                        relatedQty > 0
                          ? "bg-primary/90 hover:bg-primary text-white cursor-pointer"
                          : "bg-gray-400 text-white cursor-not-allowed opacity-50"
                      }`}
                    >
                      <FiShoppingCart size={16} />
                      {addingRelated === p.id ? "Adding..." : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
