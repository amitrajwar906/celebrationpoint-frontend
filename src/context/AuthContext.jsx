import { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user using JWT
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching user info with token...");
        const res = await meApi();
        console.log("User info fetched:", res.data);
        setUser(res.data); // { email, role }
      } catch (err) {
        console.warn("Failed to load user", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      console.log("Logout event received from axios interceptor");
      logout();
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // LOGIN
  const login = (jwtToken) => {
    console.log("Storing token in localStorage");
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  // LOGOUT
  const logout = () => {
    console.log("Clearing auth state");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
