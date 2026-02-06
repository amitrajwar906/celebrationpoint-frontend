import { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function RegisterModal({ open, onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
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
        className={`absolute inset-0 backdrop-blur-sm transition-colors duration-300 ${
          theme === "light" ? "bg-black/20" : "bg-black/70"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4 rounded-2xl border p-6 shadow-2xl transition-colors duration-300 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-card border-white/10"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors duration-300 ${
            theme === "light"
              ? "text-gray-500 hover:text-gray-800"
              : "text-white/60 hover:text-white"
          }`}
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <h2
          className={`text-2xl font-bold text-center mb-2 transition-colors duration-300 ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          Create Account
        </h2>
        <p
          className={`text-center mb-6 transition-colors duration-300 ${
            theme === "light" ? "text-gray-600" : "text-white/60"
          }`}
        >
          Join Celebrations Point
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <FiUser
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                theme === "light" ? "text-gray-500" : "text-white/40"
              }`}
            />
            <input
              placeholder="Full Name"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-primary transition-colors duration-300 ${
                theme === "light"
                  ? "bg-gray-50 border-gray-300 text-black placeholder-gray-400"
                  : "bg-black/40 border-white/10 text-white placeholder-white/40"
              }`}
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                theme === "light" ? "text-gray-500" : "text-white/40"
              }`}
            />
            <input
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-primary transition-colors duration-300 ${
                theme === "light"
                  ? "bg-gray-50 border-gray-300 text-black placeholder-gray-400"
                  : "bg-black/40 border-white/10 text-white placeholder-white/40"
              }`}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                theme === "light" ? "text-gray-500" : "text-white/40"
              }`}
            />
            <input
              type="password"
              placeholder="Password"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-primary transition-colors duration-300 ${
                theme === "light"
                  ? "bg-gray-50 border-gray-300 text-black placeholder-gray-400"
                  : "bg-black/40 border-white/10 text-white placeholder-white/40"
              }`}
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
            className={`w-full py-3 rounded-xl border border-primary text-primary transition-colors duration-300 ${
              theme === "light"
                ? "hover:bg-primary/5"
                : "hover:bg-primary/10"
            }`}
          >
            Already have account? Login
          </button>
        </form>
      </div>
    </div>
  );
}
