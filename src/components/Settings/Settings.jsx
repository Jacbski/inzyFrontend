//new
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { AuthContext } from "../../services/auth/AuthContex";
import SettingsModal from "../Modals/SettingsModal/SettingsModal";
import "./css/settings.css";

function Settings() {
  const {
    logout,
    updateUsername,
    updateEmail,
    updatePassword,
    uploadAvatar,
    deleteAccount,
    currentUser,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState(null);

  const openModal = (title, initialValues, validationSchema, onSubmit) => {
    setModalConfig({ title, initialValues, validationSchema, onSubmit });
  };

  const closeModal = () => setModalConfig(null);

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="buttons">
        <button
          onClick={() =>
            openModal(
              "Change Username",
              { newUsername: "", password: "" },
              Yup.object({
                newUsername: Yup.string()
                  .min(3, "Username must be at least 3 characters")
                  .required("Required"),
                password: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Required"),
              }),
              async (values) => {
                await updateUsername(values.newUsername, values.password);
                alert("Username updated successfully!");
              }
            )
          }
          className="edit-button"
        >
          Change Username
        </button>

        <button
          onClick={() =>
            openModal(
              "Change Email",
              { newEmail: "", password: "" },
              Yup.object({
                newEmail: Yup.string()
                  .email("Invalid email")
                  .required("Required"),
                password: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Required"),
              }),
              async (values) => {
                await updateEmail(values.newEmail, values.password);
                alert("Email updated successfully!");
              }
            )
          }
          className="edit-button"
        >
          Change Email
        </button>

        <button
          onClick={() =>
            openModal(
              "Change Password",
              { newPassword: "" },
              Yup.object({
                newPassword: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Required"),
              }),
              async (values) => {
                await updatePassword(values.newPassword);
                alert("Password updated successfully!");
              }
            )
          }
          className="edit-button"
        >
          Change Password
        </button>

        <button
          onClick={() =>
            openModal(
              "Change Avatar",
              { avatar: null },
              Yup.object({
                avatar: Yup.mixed().test(
                  "fileSize",
                  "File is too large (max 1MB)",
                  (value) => !value || value.size <= 1024 * 1024
                ),
              }),
              async (values) => {
                await uploadAvatar(values.avatar);
                alert("Avatar uploaded successfully!");
              }
            )
          }
          className="edit-button"
        >
          Change Avatar
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/"); // Przekierowanie na stronę główną
          }}
          className="logout-button"
        >
          Log Out
        </button>
        <button
          onClick={async () => {
            if (
              window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
              )
            ) {
              await deleteAccount();
              navigate("/");
            }
          }}
          className="delete-button"
        >
          Delete Account
        </button>
      </div>

      {modalConfig && (
        <SettingsModal
          isOpen={!!modalConfig}
          onRequestClose={closeModal}
          title={modalConfig.title}
          initialValues={modalConfig.initialValues}
          validationSchema={modalConfig.validationSchema}
          onSubmit={modalConfig.onSubmit}
        />
      )}

      {/* Wyświetlanie aktualnego avatara
      {currentUser && currentUser.avatar && (
        <div className="current-avatar">
          <h3>Current Avatar</h3>
          <img
            src={`data:image/jpeg;base64,${currentUser.avatar}`}
            alt="Current avatar"
            className="avatar-image"
          />
        </div>
      )} */}
    </div>
  );
}

export default Settings;
