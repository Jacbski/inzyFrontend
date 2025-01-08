import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/auth/AuthContex";
import { sendMessageToAdmin } from "../../services/api/Admin";
import "./css/Contact.scss";

const ContactSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  message: Yup.string()
    .min(10, "Too Short!")
    .max(200, "Too Long!")
    .required("Required"),
});

const Contact = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [formStatus, setFormStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (formStatus && formStatus.success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);

      // Clean up the timer
      //  when component unmounts or formStatus changes
      return () => clearTimeout(timer);
    }
  }, [formStatus, navigate]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!isLoggedIn) {
      setFormStatus({ error: "You must be logged in to send a message." });
      setSubmitting(false);
      return;
    }

    try {
      await sendMessageToAdmin(values.title, values.message);
      setFormStatus({ success: "Message sent successfully!" });
      resetForm();
    } catch (error) {
      setFormStatus({
        error: error.message || "Failed to send message. Please try again.",
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="contact">
      <h1>Contact Us</h1>
      {isLoggedIn ? (
        <Formik
          initialValues={{ title: "", message: "" }}
          validationSchema={ContactSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field type="text" name="title" />
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <Field as="textarea" name="message" />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="error"
                />
              </div>

              <button type="submit" disabled={isSubmitting}>
                Send Message
              </button>

              {formStatus && formStatus.success && (
                <div className="success-message">{formStatus.success}</div>
              )}
              {formStatus && formStatus.error && (
                <div className="error-message">{formStatus.error}</div>
              )}
            </Form>
          )}
        </Formik>
      ) : (
        <p>Please log in to send a message.</p>
      )}
    </div>
  );
};

export default Contact;
