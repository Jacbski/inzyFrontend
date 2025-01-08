// //v12 -auth dziala

import React from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, //working regex for pass
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterModal = ({ isOpen, onRequestClose, onRegister }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Register Modal"
      ariaHideApp={false}
    >
      <h2 className="modal__title">Register</h2>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await onRegister(values.username, values.email, values.password);
            onRequestClose();
          } catch (error) {
            setStatus("Registration failed. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="modal__form">
            <div className="modal__form-group">
              <label htmlFor="username" className="modal__label">
                Username
              </label>
              <Field
                id="username"
                name="username"
                type="text"
                className="modal__input"
              />
              <ErrorMessage
                name="username"
                component="p"
                className="modal__error"
              />
            </div>
            <div className="modal__form-group">
              <label htmlFor="email" className="modal__label">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="modal__input"
              />
              <ErrorMessage
                name="email"
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
              />
              <ErrorMessage
                name="password"
                component="p"
                className="modal__error"
              />
            </div>
            <div className="modal__form-group">
              <label htmlFor="confirmPassword" className="modal__label">
                Confirm Password
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="modal__input"
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="modal__error"
              />
            </div>
            {status && <p className="modal__error">{status}</p>}
            <button
              type="submit"
              className="modal__button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
      <button onClick={onRequestClose} className="modal__close">
        Close
      </button>
    </Modal>
  );
};

export default RegisterModal;
