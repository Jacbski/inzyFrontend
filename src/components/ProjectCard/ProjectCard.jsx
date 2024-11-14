import React from 'react';
import './css/ProjectCard.css';

const ProjectCard = ({ photo, title, description, opinia, isFavorite, onFavoriteToggle }) => {
    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle();
    };

    const opinionSum = Array.isArray(opinia)
        ? opinia.reduce((total, opinion) => total + opinion.positive - opinion.negative, 0)
        : 0;

    return (
        <div className="project-card">
            <div className="thumbnail-container">
                <img
                    src={photo === null || photo === "" ? "https://via.placeholder.com/150" : photo}
                    className="thumbnail"
                    alt={title || "Project thumbnail"}
                />
                <div className="trending-info">
                    <span className="trending-icon">➚</span>
                    <p className="trending-text">{opinionSum}</p>
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
