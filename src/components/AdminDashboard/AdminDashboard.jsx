import React from "react";
import { Link } from "react-router-dom";
import ReportedImage1 from "../../assets/Reported.png";
import ReportedImage2 from "../../assets/Reported2.png";
import ContactImage from "../../assets/Contact.png";
import "./css/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Admin Dashboard</h1>
      <div className="admin-dashboard__grid">
        <div className="admin-dashboard__card">
          <div
            className="admin-dashboard__card-preview"
            style={{ backgroundImage: `url(${ReportedImage1})` }}
          ></div>
          <div className="admin-dashboard__card-content">
            <h2 className="admin-dashboard__card-title">Reported Posts</h2>
            <Link to="/reported-posts" className="admin-dashboard__card-link">
              View Posts
            </Link>
          </div>
        </div>

        <div className="admin-dashboard__card">
          <div
            className="admin-dashboard__card-preview"
            style={{ backgroundImage: `url(${ReportedImage2})` }}
          ></div>
          <div className="admin-dashboard__card-content">
            <h2 className="admin-dashboard__card-title">Reported Comments</h2>
            <Link
              to="/reported-comments"
              className="admin-dashboard__card-link"
            >
              Manage Comments
            </Link>
          </div>
        </div>
        <div className="admin-dashboard__card">
          <div
            className="admin-dashboard__card-preview"
            style={{ backgroundImage: `url(${ContactImage})` }}
          ></div>
          <div className="admin-dashboard__card-content">
            <h2 className="admin-dashboard__card-title">
              Contact Form Messages
            </h2>
            <Link
              to="/contact-form-messages"
              className="admin-dashboard__card-link"
            >
              View Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
