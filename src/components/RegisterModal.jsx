import { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function RegisterModal({ open, onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔒 Lock background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // ❌ Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(form);
      console.log("Registration response:", res.data);

      toast.success("Account created successfully 🎉");
      
      // Close the register modal
      onClose();
      
      // Switch to login modal after a brief delay
      setTimeout(() => {
        onSwitchToLogin();
      }, 500);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-card border border-white/10 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-white/60 text-center mb-6">
          Join Celebration Point
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-primary"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-primary"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-primary"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary shadow-glow hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => {
              onSwitchToLogin();
              onClose();
            }}
            className="w-full py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 transition"
          >
            Already have account? Login
          </button>
        </form>
      </div>
    </div>
  );
}
