import React, { createContext, useState, useEffect } from "react";
import { api } from "../config/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user (for persistent login)
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setAuthUser(res.data.user);
    } catch (error) {
      setAuthUser(null);
      console.error("User not authenticated:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login
  const login = async (password) => {
    try {
      const res = await api.post("/auth/login", { password });
      setAuthUser(res.data.user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setAuthUser(null);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setAuthUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Change Password
  const changePassword = async (passwordData) => {
    try {
      const res = await api.post("/auth/changePassword", passwordData);
      return res.data;
    } catch (error) {
      console.error("Password change failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        loading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
