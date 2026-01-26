import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiGrid,
  FiMoon,
  FiSun,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      onClick={closeMobile}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg transition flex items-center gap-2 ${
          isActive
            ? "bg-primary/20 text-primary"
            : theme === "light"
            ? "text-gray-700 hover:text-black hover:bg-gray-200"
            : "text-white/80 hover:text-white hover:bg-white/5"
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${
        theme === "light"
          ? "bg-white/95 border-b border-gray-200"
          : "bg-gradient-to-b from-card/95 to-card/80 border-b border-white/10"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMobile}
              className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition whitespace-nowrap"
            >
              Celebration<span className={theme === "light" ? "text-black" : "text-white"}>Point</span>
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="hidden md:flex items-center gap-1">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/products">Products</NavItem>

              {isAuthenticated && (
                <>
                  <NavItem to="/orders">Orders</NavItem>

                  {/* USER PROFILE */}
                  <NavItem to="/profile">
                    <FiUser />
                    Profile
                  </NavItem>
                </>
              )}

              {/* ADMIN ENTRY */}
              {role === "ROLE_ADMIN" && (
                <NavItem to="/admin">
                  <FiGrid />
                  Admin
                </NavItem>
              )}
            </nav>

            {/* ================= DESKTOP ACTIONS ================= */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-white/10 hover:bg-white/15 text-white/70 hover:text-primary"
                }`}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {isAuthenticated && (
                <Link
                  to="/cart"
                  className={`relative transition hover:scale-110 ${
                    theme === "light"
                      ? "text-gray-700 hover:text-primary"
                      : "text-white/70 hover:text-primary"
                  }`}
                  title="Shopping Cart"
                >
                  <FiShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-primary text-black px-1.5 py-[2px] rounded-full font-bold w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              
              {!isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                    className={`px-4 py-2 rounded-lg transition font-medium ${
                      theme === "light"
                        ? "bg-gray-200 hover:bg-gray-300 text-black"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition text-black font-semibold"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              )}
            </div>

            {/* ================= MOBILE QUICK ACTIONS ================= */}
            <div className="md:hidden flex items-center gap-2">
              {/* Theme Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-white/10 hover:bg-white/15 text-white/70 hover:text-primary"
                }`}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {isAuthenticated && (
                <>
                  {/* Cart Icon */}
                  <Link
                    to="/cart"
                    onClick={closeMobile}
                    className={`relative transition text-2xl hover:scale-110 ${
                      theme === "light"
                        ? "text-gray-700 hover:text-primary"
                        : "text-white/70 hover:text-primary"
                    }`}
                  >
                    <FiShoppingCart size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 text-xs bg-primary text-black px-1.5 py-[2px] rounded-full font-bold w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile Icon */}
                  <Link
                    to="/profile"
                    onClick={closeMobile}
                    className={`p-2 rounded-lg transition text-xl ${
                      theme === "light"
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : "bg-white/10 hover:bg-primary/20 text-white/70 hover:text-primary"
                    }`}
                  >
                    <FiUser size={22} />
                  </Link>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
                      theme === "light"
                        ? "bg-gray-200 hover:bg-gray-300 text-black"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition text-black font-semibold"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* ================= MOBILE MENU TOGGLE ================= */}
            <button
              className={`md:hidden text-2xl p-2 rounded-lg transition font-semibold ${
                theme === "light"
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  : "bg-white/10 hover:bg-white/15 text-white/70 hover:text-primary"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileOpen && (
          <div className={`md:hidden border-t backdrop-blur-xl px-4 py-6 space-y-2 ${
            theme === "light"
              ? "bg-white/95 border-gray-200"
              : "bg-gradient-to-b from-card/95 to-card/80 border-white/10"
          }`}>
            <NavItem to="/">Home</NavItem>
            <NavItem to="/products">Products</NavItem>

            {isAuthenticated && (
              <>
                <NavItem to="/orders">Orders</NavItem>
              </>
            )}

            {role === "ROLE_ADMIN" && (
              <NavItem to="/admin">
                <FiGrid />
                Admin Dashboard
              </NavItem>
            )}

            <div className={`pt-4 border-t mt-4 ${
              theme === "light" ? "border-gray-200" : "border-white/10"
            }`}>
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      closeMobile();
                    }}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                      theme === "light"
                        ? "bg-gray-200 hover:bg-gray-300 text-black"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowRegister(true);
                      closeMobile();
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-black font-semibold transition hover:shadow-lg hover:shadow-primary/50"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition font-medium"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================= AUTH MODALS ================= */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
}
