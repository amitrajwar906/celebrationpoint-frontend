import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiBarChart3,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiFileText,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: FiBarChart3,
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: FiShoppingCart,
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: FiPackage,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: FiUsers,
    },
    {
      path: "/admin/audit-logs",
      label: "Audit Logs",
      icon: FiFileText,
    },
    {
      path: "/admin/profile",
      label: "Profile",
      icon: FiUser,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ path, label, icon: Icon }) => (
    <Link
      to={path}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive(path)
          ? "bg-primary text-white"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-card border-r border-white/10 flex-col fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link
            to="/admin"
            className="text-xl font-bold text-primary tracking-wide flex items-center gap-2"
          >
            <FiBarChart3 className="w-6 h-6" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg"
      >
        {isOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <aside className="md:hidden fixed inset-0 z-40 bg-card/95 backdrop-blur">
          <div className="p-6 border-b border-white/10 mb-4">
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold text-primary tracking-wide flex items-center gap-2"
            >
              <FiBarChart3 className="w-6 h-6" />
              <span>Admin</span>
            </Link>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 absolute bottom-0 left-0 right-0">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
