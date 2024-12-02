import React, { createContext, useState, useEffect, useMemo } from "react";
import { login as apiLogin, register as apiRegister } from "../api/Auth";
import { getCurrentUser } from "../api/User";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      handleLogout();
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await apiLogin(username, password);
      localStorage.setItem("access_token", response.token);
      setIsLoggedIn(true);
      await fetchCurrentUser();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      console.log("trying to register");
      console.log("Register function called with:", {
        username,
        email,
        password,
      }); // tymaczasowe sprawdzenie
      await apiRegister(username, email, password);
      console.log("Rejestracja zakończona sukcesem");
      await handleLogin(username, password);
      console.log("handleLogin");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("access_token");
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      currentUser,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
    }),
    [isLoggedIn, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
