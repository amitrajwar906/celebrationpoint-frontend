import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiShoppingCart,
  FiFileText,
  FiTag,
  FiLogOut,
  FiBox,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navItemClass =
  "flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium";

export default function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate?.(); // close mobile menu
    navigate("/");
  };

  const handleNavClick = () => {
    onNavigate?.(); // close mobile menu on link click
  };

  return (
    <aside className="w-[260px] flex flex-col bg-[#0e1425] border-r border-white/10 h-full">
      
      {/* ================= BRAND ================= */}
      <div className="px-6 py-6 text-xl font-bold tracking-wide">
        <span className="text-primary">Celebrations</span> Admin
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 px-3 space-y-2">
        
        {/* DASHBOARD */}
        <NavLink
          to="/admin"
          end
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${navItemClass} ${
              isActive
                ? "bg-primary text-black shadow-glow"
                : "text-white/70 hover:bg-white/5"
            }`
          }
        >
          <FiGrid />
          Dashboard
        </NavLink>

        {/* ORDERS */}
        <NavLink
          to="/admin/orders"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${navItemClass} ${
              isActive
                ? "bg-primary text-black shadow-glow"
                : "text-white/70 hover:bg-white/5"
            }`
          }
        >
          <FiShoppingCart />
          Orders
        </NavLink>

        {/* PRODUCTS */}
        <NavLink
          to="/admin/products"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${navItemClass} ${
              isActive
                ? "bg-primary text-black shadow-glow"
                : "text-white/70 hover:bg-white/5"
            }`
          }
        >
          <FiBox />
          Products
        </NavLink>

        {/* CATEGORIES */}
        <NavLink
          to="/admin/categories"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${navItemClass} ${
              isActive
                ? "bg-primary text-black shadow-glow"
                : "text-white/70 hover:bg-white/5"
            }`
          }
        >
          <FiTag />
          Categories
        </NavLink>

        {/* AUDIT LOGS */}
        <NavLink
          to="/admin/audit-logs"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${navItemClass} ${
              isActive
                ? "bg-primary text-black shadow-glow"
                : "text-white/70 hover:bg-white/5"
            }`
          }
        >
          <FiFileText />
          Audit Logs
        </NavLink>
      </nav>

      {/* ================= LOGOUT ================= */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}
