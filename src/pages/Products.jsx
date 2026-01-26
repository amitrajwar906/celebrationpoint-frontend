import { useEffect, useMemo, useState } from "react";
import { FiShoppingCart, FiX, FiSearch, FiFilter } from "react-icons/fi";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getProducts, getProductsByCategory } from "../api/product.api";
import { getCategories } from "../api/category.api";
import { addToCart } from "../api/cart.api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import EmptyState from "../components/EmptyState";
import { ProductCardSkeleton } from "../components/Skeleton";

export default function Products() {
  const { isAuthenticated } = useAuth();
  const { reloadCart } = useCart();
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get("category") || "";
  });

  // Price range options
  const priceRanges = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "₹0 - ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
    { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
    { label: "₹5000 - ₹10000", min: 5000, max: 10000 },
    { label: "₹10000+", min: 10000, max: Infinity },
  ];

  // Load products based on category
  useEffect(() => {
    const loadProducts = async () => {
      try {
        let res;
        if (selectedCategory) {
          // If category is selected, use the category-specific API
          res = await getProductsByCategory(selectedCategory);
          console.log(`Products for category ${selectedCategory}:`, res.data);
        } else {
          // Otherwise get all products
          res = await getProducts();
          console.log("All products fetched:", res.data);
        }
        // Backend returns array directly
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err.message);
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        console.log("Categories fetched:", res.data);
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err.message);
      }
    };

    loadCategories();
  }, []);

  // Filter products by search and price (category filtering is done at API level)
  const filteredProducts = useMemo(() => {
    const selectedRange = priceRanges.find((r) => r.label === priceRange);
    const minPrice = selectedRange?.min || 0;
    const maxPrice = selectedRange?.max || Infinity;

    return products.filter((p) => {
      // Name filter
      const nameMatch = searchName.trim()
        ? p.name.toLowerCase().includes(searchName.toLowerCase())
        : true;

      // Price filter
      const price = parseFloat(p.price);
      const priceMatch = price >= minPrice && price <= maxPrice;

      return nameMatch && priceMatch;
    });
  }, [products, searchName, priceRange]);

  // Reset filters
  const handleClearFilters = () => {
    setSearchName("");
    setPriceRange("");
    setSelectedCategory("");
    setSearchParams({});
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  // Add to cart
  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      setAddingId(productId);
      console.log(`Adding product ${productId} to cart`);
      await addToCart({ productId, quantity: 1 });
      toast.success("Added to cart");
      await reloadCart(); // Reload cart to update navbar count
    } catch (err) {
      console.error("Add to cart error:", err.message);
      toast.error("Could not add to cart");
    } finally {
      setAddingId(null);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Products</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (products.length === 0) {
    return (
      <EmptyState
        type="products"
        title="No products available"
        description="We''re adding new celebration products very soon."
        actionText="Go Home"
        actionLink="/"
      />
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <p className={`text-sm sm:text-base ${theme === "light" ? "text-gray-600" : "text-white/60"}`}>
          {filteredProducts.length} items
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
            theme === "light"
              ? "bg-gray-100 hover:bg-gray-200 text-black border border-gray-300"
              : "bg-card hover:bg-card/80 text-white border border-white/10"
          }`}
        >
          <FiFilter size={18} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Search and Filters */}
      {(showFilters || window.innerWidth >= 768) && (
        <div className={`rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 transition-all ${
          theme === "light"
            ? "bg-gray-100 border border-gray-300"
            : "bg-card border border-white/10"
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Search by name */}
            <div>
              <label className={`block text-xs sm:text-sm font-semibold mb-2 ${
                theme === "light" ? "text-gray-700" : "text-white/80"
              }`}>
                Search by Name
              </label>
              <div className="relative">
                <FiSearch className={`absolute left-3 top-3 text-sm sm:text-base ${
                  theme === "light" ? "text-gray-500" : "text-white/40"
                }`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition focus:outline-none text-sm ${
                    theme === "light"
                      ? "bg-white border-gray-400 text-black placeholder-gray-500 focus:border-blue-600"
                      : "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-primary"
                  }`}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className={`block text-xs sm:text-sm font-semibold mb-2 ${
                theme === "light" ? "text-gray-700" : "text-white/80"
              }`}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none appearance-none cursor-pointer text-sm ${
                  theme === "light"
                    ? "bg-white border-gray-400 text-black focus:border-blue-600"
                    : "bg-white/10 border-white/20 text-white focus:border-primary"
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='${
                    theme === "light" ? "000000" : "ffffff"
                  }' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="" className={theme === "light" ? "bg-white text-black" : "bg-[#0e1425] text-white"}>
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className={theme === "light" ? "bg-white text-black" : "bg-[#0e1425] text-white"}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className={`block text-xs sm:text-sm font-semibold mb-2 ${
                theme === "light" ? "text-gray-700" : "text-white/80"
              }`}>
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none appearance-none cursor-pointer text-sm ${
                  theme === "light"
                    ? "bg-white border-gray-400 text-black focus:border-blue-600"
                    : "bg-white/10 border-white/20 text-white focus:border-primary"
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='${
                    theme === "light" ? "000000" : "ffffff"
                  }' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="" className={theme === "light" ? "bg-white text-black" : "bg-[#0e1425] text-white"}>
                  Select price range
                </option>
                {priceRanges.slice(1).map((range) => (
                  <option key={range.label} value={range.label} className={theme === "light" ? "bg-white text-black" : "bg-[#0e1425] text-white"}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              {(searchName || priceRange || selectedCategory) && (
                <button
                  onClick={handleClearFilters}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition text-sm ${
                    theme === "light"
                      ? "bg-gray-300 hover:bg-gray-400 text-black"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <FiX size={18} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className={`text-base sm:text-lg ${
            theme === "light" ? "text-gray-600" : "text-white/60"
          }`}>
            {searchName || priceRange || selectedCategory
              ? `No products match your filters`
              : "No products available"}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className={`group rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-glow transition overflow-hidden flex flex-col ${
              theme === "light"
                ? "bg-white border border-gray-200"
                : "bg-card border border-white/10"
            }`}
          >
            {/* Image - Clickable */}
            <Link to={`/product/${p.id}`} className={`h-24 sm:h-28 md:h-36 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition ${
              theme === "light" ? "bg-gray-200" : "bg-black/40"
            }`}>
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{ display: p.imageUrl ? "none" : "flex" }}
                className={`w-full h-full flex items-center justify-center text-xs sm:text-sm ${
                  theme === "light" ? "text-gray-500" : "text-white/30"
                }`}
              >
                No Image
              </div>
            </Link>

            {/* Name - Clickable */}
            <Link to={`/product/${p.id}`} className="block mb-1">
              <h3 className="font-semibold truncate text-xs sm:text-sm md:text-base line-clamp-2 hover:text-primary transition">
                {p.name}
              </h3>
            </Link>

            {/* Price */}
            <p className="text-primary font-bold mb-3 sm:mb-4 text-sm sm:text-base">
              ₹{parseFloat(p.price).toFixed(2)}
            </p>

            {/* Add to cart */}
            <button
              onClick={() => handleAddToCart(p.id)}
              disabled={addingId === p.id}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg sm:rounded-xl bg-primary hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base font-medium mt-auto"
            >
              <FiShoppingCart size={16} />
              {addingId === p.id ? "Adding..." : "Add"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
