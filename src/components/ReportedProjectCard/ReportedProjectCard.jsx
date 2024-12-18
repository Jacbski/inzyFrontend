import React from 'react';
import { Link } from 'react-router-dom';
import "./css/ReportedProjectCard.css";

const ReportedProjectCard = ({ report, onDeleteProject, onDeleteReport }) => {
    const { messageID, title, message, userName, ogloszenieID } = report;

    return (
        <div className="reported-project-card">
            <div className="reported-card-content">
                <div className="reported-project-title">{title || "No Title"}</div>
                <p className="reported-body-text">{message || "No details provided"}</p>
                <p><strong>Reported by user:</strong> {userName}</p>
            </div>
            <div className="reported-actions-wrapper">
                <Link to={`/project/${ogloszenieID}`} target="_blank" rel="noopener noreferrer">
                    <button className="reported-view-button">View Post</button>
                </Link>
                <button
                    className="reported-remove-button"
                    onClick={() => onDeleteProject(ogloszenieID, messageID)}
                >
                    Delete Project
                </button>
                <button
                    className="reported-delete-report-button"
                    onClick={() => onDeleteReport(messageID)}
                >
                    Delete Report
                </button>
            </div>
        </div>
    );
};

export default ReportedProjectCard;
