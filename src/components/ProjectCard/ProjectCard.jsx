import React, { useState, useEffect, useContext } from 'react';
import './css/ProjectCard.css';
import request from '../../services/api/Request.jsx';
import { AuthContext } from '../../services/auth/AuthContex';

const ProjectCard = ({ photo, title, description, projectId }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const [opinionSum, setOpinionSum] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState([]);

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

        const fetchFavorites = async () => {
            if (isLoggedIn) {
                try {
                    const userData = await request('/api/users/current-user', 'GET', null, true);
                    const userId = userData.id;
                    const favoritesData = await request(`/api/users/ulubione/${userId}`, 'GET', null, true);
                    setFavorites(favoritesData.map((favorite) => favorite.id));
                    setIsFavorite(favoritesData.some((fav) => fav.id === projectId));
                } catch (err) {
                    console.error("Failed to fetch favorites:", err);
                }
            } else {
                setFavorites([]);
                setIsFavorite(false);
            }
        };

        fetchOpinions();
        fetchFavorites();
    }, [projectId, isLoggedIn])

    const handleFavoriteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isFavorite) {
            try {
                await request(`/api/users/dodajDoUlubionych/${projectId}`, 'POST', null, true);
                setIsFavorite(true);
            } catch (err) {
                console.error("Failed to add to favorites:", err);
            }
        }
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
                aria-label={isFavorite ? "Already in favorites" : "Add to favorites"}
                className={`favorites-button ${isFavorite ? "favorite" : ""}`}
                onClick={!isFavorite ? handleFavoriteClick : undefined}
            >
                ★
            </button>
        </div>
    );
};

export default ProjectCard;
