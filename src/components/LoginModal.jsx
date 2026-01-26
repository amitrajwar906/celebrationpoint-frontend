import { useState, useEffect } from "react";
import { FiX, FiMail, FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-card border border-white/10 p-6 shadow-2xl animate-fade-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-white/60 text-center mb-6">
          Login to continue shopping
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
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

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary shadow-glow hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
