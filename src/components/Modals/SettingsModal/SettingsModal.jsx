import React from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./css/SettingsModal.css";

const SettingsModal = ({
  isOpen,
  onRequestClose,
  title,
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
      contentLabel={title} // Poprawia dostępność
    >
      <h2>{title}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
          try {
            await onSubmit(values);
            setStatus({ success: "Action completed successfully!" });
            resetForm();
            onRequestClose();
          } catch (error) {
            setStatus({ error: error.message || "Something went wrong." });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status, setFieldValue }) => (
          <Form encType="multipart/form-data">
            {Object.keys(initialValues).map((key) => (
              <div key={key} className="form-group">
                <label htmlFor={key}>{formatLabel(key)}</label>
                {key === "avatar" ? (
                  <input
                    id={key}
                    name={key}
                    type="file"
                    accept="image/*"
                    className="form-field"
                    onChange={(event) => {
                      setFieldValue(key, event.currentTarget.files[0]);
                    }}
                  />
                ) : (
                  <Field
                    type={
                      key.toLowerCase().includes("password")
                        ? "password"
                        : "text"
                    }
                    name={key}
                    className="form-field"
                  />
                )}
                <ErrorMessage name={key} component="div" className="error" />
              </div>
            ))}

            {status && status.success && (
              <div className="success">{status.success}</div>
            )}
            {status && status.error && (
              <div className="error">{status.error}</div>
            )}

            <div className="modal-buttons">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={onRequestClose}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

// Funkcja pomocnicza do formatowania etykiet
const formatLabel = (key) => {
  const words = key.replace(/([A-Z])/g, " $1").split(" ");
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default SettingsModal;
