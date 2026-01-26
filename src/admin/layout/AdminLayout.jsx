import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#070b1a] text-white">
      
      {/* ================= DESKTOP SIDEBAR (FIXED) ================= */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        <AdminSidebar />
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide menu */}
          <div className="fixed inset-y-0 left-0 w-64 bg-[#070b1a] z-50 lg:hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h2 className="font-bold text-lg">Admin Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <FiX size={22} />
              </button>
            </div>

            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col lg:ml-[260px]">

        {/* ✅ Topbar ONLY (no hamburger here anymore) */}
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
