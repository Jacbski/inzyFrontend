import React, { useState } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../../../services/api/User";
import "../Modal.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const LoginModal = ({ isOpen, onRequestClose, onLogin }) => {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState(null);

  const handleResetPassword = async (email) => {
    try {
      await resetPassword(email);
      setResetStatus({
        success: "Password reset email sent. Please check your inbox.",
      });
    } catch (error) {
      setResetStatus({
        error: "Failed to send reset email. Please try again.",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Login Modal"
      ariaHideApp={false}
    >
      <h2 className="modal__title">
        {isResetPassword ? "Reset Password" : "Login"}
      </h2>
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        validationSchema={isResetPassword ? ResetPasswordSchema : LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          if (isResetPassword) {
            await handleResetPassword(values.email);
          } else {
            try {
              await onLogin(values.username, values.password);
              onRequestClose();
            } catch (error) {
              setStatus(
                "Login failed. Please check your credentials and try again."
              );
            }
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="modal__form">
            {!isResetPassword ? (
              <>
                <div className="modal__form-group">
                  <label htmlFor="username" className="modal__label">
                    Username
                  </label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className="modal__input"
                    autoComplete="username"
                  />
                  <ErrorMessage
                    name="username"
                    component="p"
                    className="modal__error"
                  />
                </div>
                <div className="modal__form-group">
                  <label htmlFor="password" className="modal__label">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="modal__input"
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="modal__error"
                  />
                </div>
              </>
            ) : (
              <div className="modal__form-group">
                <label htmlFor="email" className="modal__label">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="modal__input"
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="modal__error"
                />
              </div>
            )}
            {status && <p className="modal__error">{status}</p>}
            {resetStatus && (
              <p
                className={`modal__${
                  resetStatus.success ? "success" : "error"
                }`}
              >
                {resetStatus.success || resetStatus.error}
              </p>
            )}
            <button
              type="submit"
              className="modal__button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : isResetPassword
                ? "Reset Password"
                : "Login"}
            </button>
          </Form>
        )}
      </Formik>
      <div className="modal__footer">
        <button
          onClick={() => {
            setIsResetPassword(!isResetPassword);
            setResetStatus(null);
          }}
          className="modal__link"
        >
          {isResetPassword ? "Back to Login" : "Forgot Password?"}
        </button>
        <button onClick={onRequestClose} className="modal__close">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;
