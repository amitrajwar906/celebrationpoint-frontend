import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

// User Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaytmCallback from "./pages/PaytmCallback";
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";
import Profile from "./pages/Profile";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Admin
import AdminRoutes from "./admin/AdminRoutes";

function AppContent() {
  const location = useLocation();
  const { theme } = useTheme();

  // 🔑 Detect admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === "light" 
        ? "bg-white text-black" 
        : "bg-dark text-white"
    }`}>
        
        {/* 🌐 Navbar (USER ONLY) */}
        {!isAdminRoute && <Navbar />}

        {/* 📄 Page Content */}
        <main className={`flex-1 ${!isAdminRoute ? "pt-20" : ""}`}>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* ================= USER ================= */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/paytm-callback"
            element={
              <ProtectedRoute>
                <PaytmCallback />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoice/:orderId"
            element={
              <ProtectedRoute>
                <Invoice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminRoutes />
              </AdminRoute>
            }
          />

          {/* ================= 404 ================= */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-[60vh] text-white/60">
                Page not found
              </div>
            }
          />
        </Routes>
      </main>

      {/* 🦶 Footer (USER ONLY) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
