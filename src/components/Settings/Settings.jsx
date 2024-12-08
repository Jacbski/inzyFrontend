import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/auth/AuthContex";
import "./css/settings.css";

function Settings({ onDeleteAccount }) {
  const { logout, updateUsername, updateEmail, updatePassword, deleteAccount } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleUpdateUsername = async () => {
    try {
      if (!newUsername.trim() || !password.trim()) {
        alert("Both username and password are required.");
        return;
      }
      await updateUsername(newUsername, password);
      alert("Username updated successfully!");
      setIsEditing(false);
      setNewUsername("");
      setPassword("");
    } catch (error) {
      alert(error.message || "Failed to update username.");
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!newEmail.trim() || !password.trim()) {
        alert("Both email and password are required.");
        return;
      }

      await updateEmail(newEmail, password);
      alert("Email updated successfully!");
      setIsEditingEmail(false);
      setNewEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message || "Failed to update email.");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!newPassword.trim()) {
        alert("New password is required.");
        return;
      }
      await updatePassword(newPassword);
      setNewPassword("");
      setIsEditingPassword(false);
    } catch (error) {
      alert(error.message || "Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteAccount();
        navigate("/"); // Przekierowanie na stronę główną
      } catch (error) {
        alert(error.message || "Failed to delete account.");
      }
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="buttons">
        {isEditing ? (
          <div className="username-edit">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button onClick={handleUpdateUsername}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)}>Change Name</button>
        )}

        {isEditingEmail ? (
          <form
            className="email-edit"
            onSubmit={(e) => {
              e.preventDefault(); // Zapobiega domyślnemu przeładowaniu strony
              handleUpdateEmail(); // Wywołanie funkcji zmiany e-maila
            }}
          >
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditingEmail(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button onClick={() => setIsEditingEmail(true)}>Change Email</button>
        )}

        {isEditingPassword ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePassword();
            }}
          >
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditingPassword(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button onClick={() => setIsEditingPassword(true)}>
            Change Password
          </button>
        )}

        <button
          onClick={() => {
            logout();
            navigate("/"); // Przekierowanie na stronę główną
          }}
        >
          Log Out
        </button>
        <button onClick={handleDeleteAccount} className="delete">
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Settings;
