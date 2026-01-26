import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getInvoice } from "../api/invoice.api";

export default function Invoice() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const res = await getInvoice(orderId);

        // Backend returns PDF (blob)
        const blob = new Blob([res.data], {
          type: "application/pdf",
        });

        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");

      } catch {
        toast.error("Failed to load invoice");
        navigate("/orders");
      }
    };

    loadInvoice();
  }, [orderId, navigate]);

  return (
    <div className="flex items-center justify-center h-[60vh] text-white/60">
      Opening invoice...
    </div>
  );
}
