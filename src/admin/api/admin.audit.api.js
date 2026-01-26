import api from "../../api/axios";

/* =========================================
   ADMIN AUDIT LOGS API
   Backend: AdminAuditLogController
   ========================================= */

/**
 * GET audit logs (Admin)
 * GET /api/admin/audit-logs?page=0&size=10
 */
export const getAuditLogs = (page = 0, size = 10) => {
  return api.get("/api/admin/audit-logs", {
    params: {
      page,
      size,
    },
  });
};
