// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../services/auth/AuthContex";
// import "./css/settings.css";

// function Settings({ onDeleteAccount }) {
//   const { logout, updateUsername, updateEmail, updatePassword, deleteAccount } =
//     useContext(AuthContext);
//   const navigate = useNavigate();

//   const [newUsername, setNewUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isEditing, setIsEditing] = useState(false);

//   const [newEmail, setNewEmail] = useState("");
//   const [passwordForEmail, setPasswordForEmail] = useState("");
//   const [isEditingEmail, setIsEditingEmail] = useState(false);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [isEditingPassword, setIsEditingPassword] = useState(false);

//   const handleUpdateUsername = async () => {
//     try {
//       if (!newUsername.trim() || !password.trim()) {
//         alert("Both username and password are required.");
//         return;
//       }
//       await updateUsername(newUsername, password);
//       alert("Username updated successfully!");
//       setIsEditing(false);
//       setNewUsername("");
//       setPassword("");
//     } catch (error) {
//       alert(error.message || "Failed to update username.");
//     }
//   };

//   const handleUpdateEmail = async () => {
//     try {
//       if (!newEmail.trim() || !password.trim()) {
//         alert("Both email and password are required.");
//         return;
//       }

//       await updateEmail(newEmail, password);
//       alert("Email updated successfully!");
//       setIsEditingEmail(false);
//       setNewEmail("");
//       setPassword("");
//     } catch (error) {
//       alert(error.message || "Failed to update email.");
//     }
//   };

//   const handleUpdatePassword = async () => {
//     try {
//       if (!newPassword.trim()) {
//         alert("New password is required.");
//         return;
//       }
//       await updatePassword(newPassword);
//       setNewPassword("");
//       setIsEditingPassword(false);
//     } catch (error) {
//       alert(error.message || "Failed to update password.");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete your account? This action cannot be undone."
//       )
//     ) {
//       try {
//         await deleteAccount();
//         navigate("/"); // Przekierowanie na stronę główną
//       } catch (error) {
//         alert(error.message || "Failed to delete account.");
//       }
//     }
//   };

//   return (
//     <div className="settings">
//       <h2>Settings</h2>
//       <div className="buttons">
//         {isEditing ? (
//           <div className="username-edit">
//             <input
//               type="text"
//               value={newUsername}
//               onChange={(e) => setNewUsername(e.target.value)}
//               placeholder="Enter new username"
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//             <button onClick={handleUpdateUsername}>Save</button>
//             <button onClick={() => setIsEditing(false)}>Cancel</button>
//           </div>
//         ) : (
//           <button onClick={() => setIsEditing(true)}>Change Name</button>
//         )}

//         {isEditingEmail ? (
//           <form
//             className="email-edit"
//             onSubmit={(e) => {
//               e.preventDefault(); // Zapobiega domyślnemu przeładowaniu strony
//               handleUpdateEmail(); // Wywołanie funkcji zmiany e-maila
//             }}
//           >
//             <input
//               type="email"
//               value={newEmail}
//               onChange={(e) => setNewEmail(e.target.value)}
//               placeholder="Enter new email"
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//             <button type="submit">Save</button>
//             <button type="button" onClick={() => setIsEditingEmail(false)}>
//               Cancel
//             </button>
//           </form>
//         ) : (
//           <button onClick={() => setIsEditingEmail(true)}>Change Email</button>
//         )}

//         {isEditingPassword ? (
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleUpdatePassword();
//             }}
//           >
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="Enter new password"
//             />
//             <button type="submit">Save</button>
//             <button type="button" onClick={() => setIsEditingPassword(false)}>
//               Cancel
//             </button>
//           </form>
//         ) : (
//           <button onClick={() => setIsEditingPassword(true)}>
//             Change Password
//           </button>
//         )}

//         <button
//           onClick={() => {
//             logout();
//             navigate("/"); // Przekierowanie na stronę główną
//           }}
//         >
//           Log Out
//         </button>
//         <button onClick={handleDeleteAccount} className="delete">
//           Delete Account
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Settings;

// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { AuthContext } from "../../services/auth/AuthContex";
// import "./css/settings.css";

// const validationSchemas = {
//   username: Yup.object().shape({
//     newUsername: Yup.string()
//       .min(3, "Username must be at least 3 characters")
//       .required("New username is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Current password is required"),
//   }),
//   email: Yup.object().shape({
//     newEmail: Yup.string()
//       .email("Invalid email format")
//       .required("New email is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Current password is required"),
//   }),
//   password: Yup.object().shape({
//     newPassword: Yup.string()
//       .min(6, "New password must be at least 6 characters")
//       .required("New password is required"),
//   }),
//   avatar: Yup.object().shape({
//     avatar: Yup.mixed().test(
//       "fileSize",
//       "File is too large (max 1MB)",
//       (value) => {
//         if (!value) return true; // No file selected is valid
//         return value.size <= 1024 * 1024; // 1MB limit
//       }
//     ),
//   }),
// };

// function Settings() {
//   const {
//     logout,
//     updateUsername,
//     updateEmail,
//     updatePassword,
//     deleteAccount,
//     uploadAvatar,
//     currentUser,
//   } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [editingSection, setEditingSection] = useState(null); // 'username', 'email', 'password', 'avatar'

//   const handleDeleteAccount = async () => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete your account? This action cannot be undone."
//       )
//     ) {
//       try {
//         await deleteAccount();
//         navigate("/"); // Przekierowanie na stronę główną
//       } catch (error) {
//         alert(error.message || "Failed to delete account.");
//       }
//     }
//   };

//   return (
//     <div className="settings">
//       <h2>Settings</h2>
//       <div className="buttons">
//         <button
//           onClick={() =>
//             setEditingSection(editingSection === "username" ? null : "username")
//           }
//         >
//           {editingSection === "username" ? "Cancel" : "Change Name"}
//         </button>

//         <button
//           onClick={() =>
//             setEditingSection(editingSection === "email" ? null : "email")
//           }
//         >
//           {editingSection === "email" ? "Cancel" : "Change Email"}
//         </button>

//         <button
//           onClick={() =>
//             setEditingSection(editingSection === "password" ? null : "password")
//           }
//         >
//           {editingSection === "password" ? "Cancel" : "Change Password"}
//         </button>

//         <button
//           onClick={() =>
//             setEditingSection(editingSection === "avatar" ? null : "avatar")
//           }
//         >
//           {editingSection === "avatar" ? "Cancel" : "Change Avatar"}
//         </button>

//         <button
//           onClick={() => {
//             logout();
//             navigate("/"); // Przekierowanie na stronę główną
//           }}
//         >
//           Log Out
//         </button>
//         <button onClick={handleDeleteAccount} className="delete">
//           Delete Account
//         </button>
//       </div>

//       {/* Sekcja zmiany nazwy użytkownika */}
//       {editingSection === "username" && (
//         <div className="edit-section">
//           <h3>Change Username</h3>
//           <Formik
//             initialValues={{ newUsername: "", password: "" }}
//             validationSchema={validationSchemas.username}
//             onSubmit={async (
//               values,
//               { setSubmitting, setStatus, resetForm }
//             ) => {
//               try {
//                 await updateUsername(values.newUsername, values.password);
//                 setStatus({ success: "Username updated successfully!" });
//                 resetForm();
//                 setEditingSection(null);
//               } catch (error) {
//                 setStatus({
//                   error: error.message || "Failed to update username.",
//                 });
//               } finally {
//                 setSubmitting(false);
//               }
//             }}
//           >
//             {({ isSubmitting, status }) => (
//               <Form>
//                 <div>
//                   <label htmlFor="newUsername">New Username</label>
//                   <Field type="text" name="newUsername" />
//                   <ErrorMessage
//                     name="newUsername"
//                     component="div"
//                     className="error"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="password">Current Password</label>
//                   <Field type="password" name="password" />
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="error"
//                   />
//                 </div>

//                 {status && status.success && (
//                   <div className="success">{status.success}</div>
//                 )}
//                 {status && status.error && (
//                   <div className="error">{status.error}</div>
//                 )}

//                 <button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Updating..." : "Update Username"}
//                 </button>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       )}

//       {/* Sekcja zmiany emaila */}
//       {editingSection === "email" && (
//         <div className="edit-section">
//           <h3>Change Email</h3>
//           <Formik
//             initialValues={{ newEmail: "", password: "" }}
//             validationSchema={validationSchemas.email}
//             onSubmit={async (
//               values,
//               { setSubmitting, setStatus, resetForm }
//             ) => {
//               try {
//                 await updateEmail(values.newEmail, values.password);
//                 setStatus({ success: "Email updated successfully!" });
//                 resetForm();
//                 setEditingSection(null);
//               } catch (error) {
//                 setStatus({
//                   error: error.message || "Failed to update email.",
//                 });
//               } finally {
//                 setSubmitting(false);
//               }
//             }}
//           >
//             {({ isSubmitting, status }) => (
//               <Form>
//                 <div>
//                   <label htmlFor="newEmail">New Email</label>
//                   <Field type="email" name="newEmail" />
//                   <ErrorMessage
//                     name="newEmail"
//                     component="div"
//                     className="error"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="password">Current Password</label>
//                   <Field type="password" name="password" />
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="error"
//                   />
//                 </div>

//                 {status && status.success && (
//                   <div className="success">{status.success}</div>
//                 )}
//                 {status && status.error && (
//                   <div className="error">{status.error}</div>
//                 )}

//                 <button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Updating..." : "Update Email"}
//                 </button>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       )}

//       {/* Sekcja zmiany hasła */}
//       {editingSection === "password" && (
//         <div className="edit-section">
//           <h3>Change Password</h3>
//           <Formik
//             initialValues={{ newPassword: "" }}
//             validationSchema={validationSchemas.password}
//             onSubmit={async (
//               values,
//               { setSubmitting, setStatus, resetForm }
//             ) => {
//               try {
//                 await updatePassword(values.newPassword);
//                 setStatus({ success: "Password updated successfully!" });
//                 resetForm();
//                 setEditingSection(null);
//               } catch (error) {
//                 setStatus({
//                   error: error.message || "Failed to update password.",
//                 });
//               } finally {
//                 setSubmitting(false);
//               }
//             }}
//           >
//             {({ isSubmitting, status }) => (
//               <Form>
//                 <div>
//                   <label htmlFor="newPassword">New Password</label>
//                   <Field type="password" name="newPassword" />
//                   <ErrorMessage
//                     name="newPassword"
//                     component="div"
//                     className="error"
//                   />
//                 </div>

//                 {status && status.success && (
//                   <div className="success">{status.success}</div>
//                 )}
//                 {status && status.error && (
//                   <div className="error">{status.error}</div>
//                 )}

//                 <button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Updating..." : "Update Password"}
//                 </button>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       )}

//       {/* Sekcja uploadu avatara */}
//       {editingSection === "avatar" && (
//         <div className="edit-section">
//           <h3>Change Avatar</h3>
//           <Formik
//             initialValues={{ avatar: null }}
//             validationSchema={validationSchemas.avatar}
//             onSubmit={async (
//               values,
//               { setSubmitting, setStatus, resetForm }
//             ) => {
//               try {
//                 await uploadAvatar(values.avatar);
//                 setStatus({ success: "Avatar uploaded successfully!" });
//                 resetForm();
//                 setEditingSection(null);
//               } catch (error) {
//                 setStatus({
//                   error: error.message || "Failed to upload avatar.",
//                 });
//               } finally {
//                 setSubmitting(false);
//               }
//             }}
//           >
//             {({ isSubmitting, setFieldValue, status }) => (
//               <Form>
//                 <div>
//                   <label htmlFor="avatar">Select Avatar</label>
//                   <input
//                     type="file"
//                     name="avatar"
//                     accept="image/*"
//                     onChange={(event) => {
//                       setFieldValue("avatar", event.currentTarget.files[0]);
//                     }}
//                   />
//                   <ErrorMessage
//                     name="avatar"
//                     component="div"
//                     className="error"
//                   />
//                 </div>

//                 {status && status.success && (
//                   <div className="success">{status.success}</div>
//                 )}
//                 {status && status.error && (
//                   <div className="error">{status.error}</div>
//                 )}

//                 <button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Uploading..." : "Upload Avatar"}
//                 </button>
//               </Form>
//             )}
//           </Formik>

//           {/* Wyświetlanie aktualnego avatara */}
//           {currentUser && currentUser.avatar && (
//             <div className="current-avatar">
//               <h4>Current Avatar</h4>
//               <img
//                 src={`data:image/jpeg;base64,${currentUser.avatar}`}
//                 alt="Current avatar"
//                 className="avatar-image"
//               />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Settings;

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

      {/* Wyświetlanie aktualnego avatara */}
      {currentUser && currentUser.avatar && (
        <div className="current-avatar">
          <h3>Current Avatar</h3>
          <img
            src={`data:image/jpeg;base64,${currentUser.avatar}`}
            alt="Current avatar"
            className="avatar-image"
          />
        </div>
      )}
    </div>
  );
}

export default Settings;
