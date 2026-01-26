import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiStar } from "react-icons/fi";
import { getProducts } from "../api/product.api";
import { getCategories } from "../api/category.api";
import { ProductCardSkeleton } from "../components/Skeleton";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts().catch(() => ({ data: [] })),
          getCategories().catch(() => ({ data: [] })),
        ]);

        setProducts(Array.isArray(productsRes.data) ? productsRes.data.slice(0, 4) : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="min-h-screen md:min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 py-8 md:py-0">
          {/* Left */}
          <div className="flex-1 w-full space-y-4 sm:space-y-6 text-center md:text-left">
            <span className="inline-flex items-center justify-center md:justify-start gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary text-sm sm:text-base">
              <FiStar size={16} />
              Premium Celebration Store
            </span>

            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words">
              Make Every
              <span className="text-primary block sm:inline"> Celebration</span>
              <br className="hidden sm:block" />
              Truly Special 
            </h1>

            <p className="text-white/70 max-w-2xl mx-auto md:mx-0 text-base sm:text-base lg:text-lg leading-relaxed">
              Discover premium gifts, decorations, and celebration essentials 
              curated to turn moments into memories.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-primary text-white shadow-glow hover:opacity-90 transition text-base sm:text-base"
              >
                <FiShoppingBag size={18} />
                Shop Now
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-base sm:text-base"
              >
                Explore Products
                <FiArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right (Featured Products) */}
          <div className="flex-1 w-full">
            <div className={`relative rounded-2xl sm:rounded-3xl bg-gradient-to-br p-6 sm:p-8 md:p-10 shadow-2xl ${
              theme === "light"
                ? "from-blue-100 via-white to-transparent border border-gray-300"
                : "from-primary/20 via-white/5 to-transparent border border-white/10"
            }`}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-32 rounded-2xl animate-pulse ${
                    theme === "light"
                      ? "bg-gray-200 border border-gray-300"
                      : "bg-card border border-white/10"
                  }`} />
                ))
              ) : products.length > 0 ? (
                products.map((p) => (
                  <div
                    key={p.id}
                    className={`h-24 sm:h-28 md:h-32 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm text-center p-2 ${
                      theme === "light"
                        ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-black"
                        : "bg-gradient-to-br from-primary/10 to-primary/5 border border-white/10 text-white"
                    }`}
                  >
                    <p className="font-semibold truncate line-clamp-2">{p.name}</p>
                    <p className="text-primary text-xs mt-1">₹{p.price}</p>
                  </div>
                ))
              ) : (
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-24 sm:h-28 md:h-32 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs sm:text-sm ${
                      theme === "light"
                        ? "bg-gray-200 border border-gray-300 text-gray-500"
                        : "bg-card border border-white/10 text-white/40"
                    }`}
                  >
                    Product {i}
                  </div>
                ))
              )}
            </div>

            <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-6 bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-glow text-xs sm:text-sm whitespace-nowrap">
              Trending 
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <div className="py-12 sm:py-16 md:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-glow transition text-center ${
                  theme === "light"
                    ? "bg-white border border-gray-200 hover:border-blue-600"
                    : "bg-card border border-white/10 hover:border-primary/50"
                }`}
              >
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg line-clamp-2">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FEATURES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 py-12 sm:py-16 md:py-20">
        {[
          {
            title: "Premium Quality",
            desc: "Carefully selected products with top quality standards.",
          },
          {
            title: "Fast Delivery",
            desc: "Reliable and fast delivery for every order.",
          },
          {
            title: "Secure Payments",
            desc: "Safe & secure checkout with trusted payment providers.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-glow transition ${
              theme === "light"
                ? "bg-white border border-gray-200"
                : "bg-card border border-white/10"
            }`}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {f.title}
            </h3>
            <p className={`text-sm sm:text-base ${
              theme === "light" ? "text-gray-600" : "text-white/60"
            }`}>{f.desc}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
