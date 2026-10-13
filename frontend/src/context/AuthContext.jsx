import { createContext, useContext, useMemo, useState } from "react";

import { authAPI } from "../services/api";

const AuthContext = createContext(null);

function getStoredUser() {
  const stored = localStorage.getItem("oa_user");
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, role, user_id, full_name } = response.data;
      
      const userData = { 
        id: user_id, 
        email, 
        full_name, 
        role  // must be stored
      };

      localStorage.setItem("oa_token", access_token);
      localStorage.setItem("oa_user", JSON.stringify(userData));
      setUser(userData);

      return { role };  // MUST return role so callers can check it
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;  // re-throw so the page catch block runs
    } finally {
      setLoading(false);
    }
  };

  function logout(shouldRedirect = true) {
    localStorage.removeItem("oa_token");
    localStorage.removeItem("oa_user");
    setUser(null);
    if (shouldRedirect) {
      window.location.href = '/';
    }
  }

  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin,
      login,
      logout,
      loading,
      error
    }),
    [user, isAdmin, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
