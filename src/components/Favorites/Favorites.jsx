import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./css/Favorites.css";
import request from "../../services/api/Request.jsx";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedProjects, setDisplayedProjects] = useState(5);

    const projectsPerLoad = 5;

    const fetchCurrentUser = async () => {
        try {
            const user = await request("/api/users/current-user", "GET", null, true);
            setCurrentUser(user);
        } catch (err) {
            console.warn("User not logged in:", err);
            setCurrentUser(null);
            setIsLoading(false);
        }
    };

    const fetchAllFavorites = async () => {
        try {
            setIsLoading(true);
            const response = await request(
                `/api/users/ulubione/${currentUser.id}`,
                "GET",
                null,
                true
            );

            if (response && response.length > 0) {
                setFavorites(response);
            }
        } catch (err) {
            console.error("Failed to fetch favorites:", err);
            setError("Failed to load favorites. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchCurrentUser();
        };
        loadData();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchAllFavorites();
        }
    }, [currentUser]);

    const handleLoadMore = () => {
        setDisplayedProjects(prevDisplayed => prevDisplayed + projectsPerLoad);
    };

    if (!currentUser && !isLoading) {
        return (
            <div className="project-feed">
                <h1 className="project-feed-title">My Favorite Projects</h1>
                <p>You need to log in to view your favorite projects.</p>
            </div>
        );
    }

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">My Favorite Projects</h1>
            {isLoading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {favorites.length === 0 && !isLoading && <div>No favorite projects found.</div>}
            <div className="favorites-list">
                {favorites.slice(0, displayedProjects).map((project) => (
                    <Link to={`/project/${project.id}`} key={project.id}>
                        <ProjectCard
                            description={project.description}
                            photo={project.photo}
                            title={project.title}
                            projectId={project.id}
                            isFavorite={true}
                            disableFavorite={true}
                        />
                    </Link>
                ))}
            </div>
            {displayedProjects < favorites.length && (
                <div className="load-more-button">
                    <button onClick={handleLoadMore}>Load More</button>
                </div>
            )}
        </div>
    );
};

export default Favorites;

