import { FiShield, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function AdminTopbar({
  title = "Dashboard",
  onMenuClick,
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0b1020]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        
        {/* ================= LEFT (MENU + TITLE) ================= */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <FiMenu size={22} />
            </button>
          )}

          {/* Title */}
          <h1 className="text-lg md:text-xl font-semibold tracking-wide">
            {title}
          </h1>
        </div>

        {/* ================= ADMIN INFO ================= */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <FiShield className="text-primary" />
          <div className="text-sm leading-tight">
            <p className="font-medium">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-xs text-white/50">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
