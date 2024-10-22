import React from 'react';
import './css/ProjectCard.css';

const ProjectCard = ({ thumbnail, title, description, trends, isFavorite, onFavoriteToggle }) => {
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onFavoriteToggle();
    };

    return (
        <div className="project-card">
            <div className="thumbnail-container">
                <img src={thumbnail} className="thumbnail" alt={title} />
                <div className="trending-info">
                    <span className="trending-icon">➚</span>
                    <p className="trending-text">+{trends}</p>
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
