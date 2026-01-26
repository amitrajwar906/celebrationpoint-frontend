import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminCategories from "./pages/AdminCategories";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminProfile from "./pages/AdminProfile";
import AdminProducts from "./pages/AdminProducts";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}
