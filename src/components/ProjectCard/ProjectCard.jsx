import React, { useState, useEffect } from 'react';
import './css/ProjectCard.css';
import request from '../../services/api/Request.jsx';

const ProjectCard = ({ photo, title, description, projectId, isFavorite, onFavoriteToggle }) => {
    const [opinionSum, setOpinionSum] = useState(0);

    useEffect(() => {
        const fetchOpinions = async () => {
            try {
                const data = await request(`/api/ogloszenie/${projectId}/opinie`, 'GET', null, false);
                if (data) {
                    setOpinionSum((data.positive || 0) - (data.negative || 0));
                }
            } catch (err) {
                console.error("Failed to fetch opinions:", err);
            }
        };

        fetchOpinions();
    }, [projectId]);

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle();
    };

    const getLikesScoreClass = () => {
        if (opinionSum > 0) return 'likes-positive';
        if (opinionSum < 0) return 'likes-negative';
        return 'likes-neutral';
    };

    return (
        <div className="project-card">
            <div className="thumbnail-container">
                <img
                    src={
                        photo
                            ? `data:image/png;base64,${photo}`
                            : "https://via.placeholder.com/150"
                    }
                    className="thumbnail"
                    alt={title || "Project thumbnail"}
                />
                <div className={`likes-info ${getLikesScoreClass()}`}>
                    <span className="likes-score">{opinionSum}</span>
                </div>
            </div>
            <div className="card-content">
                <div className="project-title">{title}</div>
                <p className="body-text">{description}</p>
            </div>
            <button
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={`favorites-button ${isFavorite ? "favorite" : ""}`}
                onClick={handleFavoriteClick}
            >
                ★
            </button>
        </div>
    );
};

export default ProjectCard;
