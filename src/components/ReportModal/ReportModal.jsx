import React, { useState } from 'react';
import './css/ReportModal.css';

const MAX_TITLE_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 200;

export default function ReportModal({ onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required.";
        if (title.length > MAX_TITLE_LENGTH) newErrors.title = `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
        if (!message.trim()) newErrors.message = "Message is required.";
        if (message.length > MAX_MESSAGE_LENGTH) newErrors.message = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`;

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit(title.trim(), message.trim());
        }
    };

    return (
        <div className="report-modal-overlay">
            <div className="report-modal-content">
                <h2>Report</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Title (max {MAX_TITLE_LENGTH} chars):</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={MAX_TITLE_LENGTH}
                        />
                        {errors.title && <p className="error">{errors.title}</p>}
                    </div>
                    <div className="form-group">
                        <label>Message (max {MAX_MESSAGE_LENGTH} chars):</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={MAX_MESSAGE_LENGTH}
                            rows={5}
                        />
                        {errors.message && <p className="error">{errors.message}</p>}
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-button">Submit Report</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
