// //v12 - use auth dziala

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

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginModal = ({ isOpen, onRequestClose, onLogin }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Login Modal"
      ariaHideApp={false}
    >
      <h2 className="modal__title">Login</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await onLogin(values.username, values.password);
            onRequestClose();
          } catch (error) {
            setStatus(
              "Login failed. Please check your credentials and try again."
            );
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
            {status && <p className="modal__error">{status}</p>}
            <button
              type="submit"
              className="modal__button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
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

export default LoginModal;
