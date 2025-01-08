import React, { createContext, useState, useEffect, useMemo } from "react";
import { login as apiLogin, register as apiRegister } from "../api/Auth";

import {
  getCurrentUser,
  updateUser,
  deleteUser,
  uploadAvatar,
} from "../api/User";

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

  const updateUsername = async (newUsername, password) => {
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    if (!password) {
      throw new Error("Password is required to update username");
    }

    try {
      // Wywołanie API do zmiany nazwy użytkownika
      await updateUser(currentUser.id, { userName: newUsername });

      // Wylogowanie użytkownika
      handleLogout();

      // Ponowne logowanie z nową nazwą użytkownika
      await handleLogin(newUsername, password);

      // Zaktualizuj stan użytkownika po pomyślnym logowaniu
      await fetchCurrentUser();

      alert("Username updated successfully, and you are now logged in!");
    } catch (error) {
      console.error("Error updating username:", error);
      throw error;
    }
  };

  const updateEmail = async (newEmail, password) => {
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    if (!password) {
      throw new Error("Password is required to update email");
    }

    try {
      // Wywołanie API do zmiany e-maila
      await updateUser(currentUser.id, { email: newEmail });

      // Wylogowanie użytkownika
      handleLogout();

      // Ponowne logowanie z aktualnym username i hasłem
      await handleLogin(currentUser.userName, password);

      // Aktualizacja stanu użytkownika
      await fetchCurrentUser();

      alert("Email updated successfully, and you are now logged in!");
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    if (!newPassword) {
      throw new Error("New password is required");
    }

    try {
      // Wywołanie API do zmiany hasła, przekazując tylko nowe hasło
      await updateUser(currentUser.id, { password: newPassword });

      // Wylogowanie użytkownika po zmianie hasła
      handleLogout();

      alert("Password updated successfully. Please log in again.");
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    try {
      // Wywołanie API do usunięcia konta
      await deleteUser(currentUser.id);

      // Wylogowanie użytkownika po usunięciu konta
      handleLogout();

      alert("Account deleted successfully.");
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  ///test
  const handleAvatarUpload = async (file) => {
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    try {
      await uploadAvatar(currentUser.id, file);
      await fetchCurrentUser(); // Refresh user data to get the new avatar
      alert("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      currentUser,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      updateUsername,
      updateEmail,
      updatePassword,
      deleteAccount,
      uploadAvatar: handleAvatarUpload,
    }),
    [isLoggedIn, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
