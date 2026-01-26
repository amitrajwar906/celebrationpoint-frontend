import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

import AdminLayout from "../layout/AdminLayout";
import {
  getOrderCancellations,
  approveCancellation,
  rejectCancellation,
} from "../api/admin.cancellations.api";

export default function OrderCancellations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadCancellations = async () => {
    try {
      setLoading(true);
      const res = await getOrderCancellations();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.content || [];

      setRequests(data);
    } catch (err) {
      toast.error("Failed to load cancellation requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCancellations();
  }, []);

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await approveCancellation(id);
      toast.success("Cancellation approved");
      await loadCancellations();
    } catch {
      toast.error("Failed to approve cancellation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);
      await rejectCancellation(id);
      toast.success("Cancellation rejected");
      await loadCancellations();
    } catch {
      toast.error("Failed to reject cancellation");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout title="Order Cancellations">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">
          Cancellation Requests
        </h2>

        <button
          onClick={loadCancellations}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="text-white/60">
          No cancellation requests found
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Request ID</th>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">
                    #{req.id}
                  </td>

                  <td className="px-4 py-3">
                    #{req.orderId}
                  </td>

                  <td className="px-4 py-3">
                    {req.reason || "-"}
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleApprove(req.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                    >
                      <FiCheckCircle />
                      Approve
                    </button>

                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleReject(req.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                    >
                      <FiXCircle />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
