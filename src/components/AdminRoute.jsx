import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminRoute
 * - Allows access only if user is authenticated
 * - AND has ROLE_ADMIN
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  // ⏳ While auth is loading (JWT check)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-white/60">
        Checking permissions...
      </div>
    );
  }

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ❌ Logged in but NOT admin
  if (user?.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return children;
}
