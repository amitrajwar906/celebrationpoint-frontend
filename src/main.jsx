import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

// Global styles
import "./index.css";
import "./theme.css";

function ToasterWithTheme() {
  const getTheme = () => {
    // Check the current theme from DOM
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('light') ? 'light' : 'dark';
    }
    return 'dark';
  };

  const theme = getTheme();
  
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: theme === "light" ? "#ffffff" : "#111118",
          color: theme === "light" ? "#000000" : "#ffffff",
          border: theme === "light" ? "1px solid #e0e0e0" : "1px solid rgba(255,255,255,0.08)",
        },
        success: {
          style: {
            background: theme === "light" ? "#ffffff" : "#111118",
            color: theme === "light" ? "#000000" : "#ffffff",
            border: theme === "light" ? "1px solid #e0e0e0" : "1px solid rgba(255,255,255,0.08)",
          },
        },
        error: {
          style: {
            background: theme === "light" ? "#fef2f2" : "#111118",
            color: theme === "light" ? "#991b1b" : "#fca5a5",
            border: theme === "light" ? "1px solid #fee2e2" : "1px solid rgba(255,255,255,0.08)",
          },
        },
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 🔐 Auth Provider */}
      <AuthProvider>
        {/* 🎨 Theme Provider */}
        <ThemeProvider>
          {/* 🛒 Cart Provider (required for Navbar cart count) */}
          <CartProvider>
            {/* 🔔 Toast Notifications */}
            <ToasterWithTheme />

            {/* 🚀 App */}
            <App />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
