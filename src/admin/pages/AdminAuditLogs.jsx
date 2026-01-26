import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";

import { getAuditLogs } from "../api/admin.audit.api";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD LOGS ================= */
  const loadLogs = async () => {
    try {
      setLoading(true);

      const res = await getAuditLogs();

      // ✅ FIX: backend returns Page<AuditLog>
      const data = Array.isArray(res.data?.content)
        ? res.data.content
        : [];

      setLogs(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Logs</h1>

        <button
          onClick={loadLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-white/60">No audit logs found</p>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 text-sm font-semibold text-white/70">
            <div className="col-span-3">User</div>
            <div className="col-span-5">Action</div>
            <div className="col-span-2">IP</div>
            <div className="col-span-2">Time</div>
          </div>

          {/* TABLE BODY */}
          <div className="divide-y divide-white/10">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 text-sm hover:bg-white/5 transition"
              >
                <div className="col-span-3 truncate">
                  {log.performedBy || "System"}
                </div>

                <div className="col-span-5 text-white/80">
                  {log.action}
                </div>

                <div className="col-span-2 text-white/60">
                  {log.ipAddress || "-"}
                </div>

                <div className="col-span-2 text-white/60">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
