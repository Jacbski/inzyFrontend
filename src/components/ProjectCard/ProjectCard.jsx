import React from 'react';
import './css/ProjectCard.css';

const ProjectCard = ({ thumbnail, title, description, trends }) => {
    return (
        <div className="project-card">
            <div className="thumbnail-container">
                <img src={thumbnail} className="thumbnail">

                </img>
                <div className="trending-info">
                    <span className="trending-icon">➚</span>
                    <p className="trending-text">+{trends}</p>
                </div>
            </div>
            <div className="card-content">
                <div className="project-title">{title}</div>
                <p className="body-text">{description}</p>
            </div>
            <button aria-label="add to favorites" className="favorites-button">
                ★
            </button>
        </div>
    );
};


export default ProjectCard;