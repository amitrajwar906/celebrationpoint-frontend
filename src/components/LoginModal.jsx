import { useState, useEffect } from "react";
import { FiX, FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Lock background scroll
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

  // ESC key close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      console.log("Logging in with email:", form.email);

      const res = await loginUser(form);
      console.log("Login response:", res.data);

      // Extract token and role from response
      const token = res.data.token;
      const role = res.data.role;
      
      if (!token) {
        throw new Error("No token in response");
      }

      login(token);
      toast.success("Welcome back!");
      
      // Redirect based on role
      if (role === "ADMIN") {
        console.log("Admin detected, redirecting to admin dashboard");
        navigate("/admin/dashboard");
      }
      
      onClose();
    } catch (err) {
      console.error("Login error:", err.message);
      toast.error("Invalid email or password");
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
        className={`relative w-full max-w-md mx-4 rounded-2xl border p-6 shadow-2xl animate-fade-in transition-colors duration-300 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-card border-white/10"
        }`}
      >
        {/* Close */}
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
          Welcome Back
        </h2>
        <p
          className={`text-center mb-6 transition-colors duration-300 ${
            theme === "light" ? "text-gray-600" : "text-white/60"
          }`}
        >
          Login to continue shopping
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
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

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary shadow-glow hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Create Account Button */}
          <button
            type="button"
            onClick={() => {
              onSwitchToRegister();
              onClose();
            }}
            className={`w-full py-3 rounded-xl border border-primary text-primary transition-colors duration-300 ${
              theme === "light"
                ? "hover:bg-primary/5"
                : "hover:bg-primary/10"
            }`}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
