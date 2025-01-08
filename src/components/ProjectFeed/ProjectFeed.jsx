import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./css/ProjectFeed.css";
import request from "../../services/api/Request.jsx";

const ProjectFeed = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [activeFilter, setActiveFilter] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);

    const projectsPerPage = 5;

    const fetchProjects = async (page = 0, filter = null, category = null) => {
        try {
            setIsLoading(true);

            let endpoint = `/api/ogloszenie/getAll?pageNumber=${page}&pageSize=${projectsPerPage}`;

            if (filter) {
                endpoint = `/api/ogloszenie/sorted/${filter}?pageNumber=${page}&pageSize=${projectsPerPage}`;
            } else if (category) {
                endpoint = `/api/ogloszenie/getByKategoria/${category}?pageNumber=${page}&pageSize=${projectsPerPage}`;
            }

            const response = await request(endpoint, "GET", null, false);

            if (response) {
                setProjects(response.content);
                setTotalPages(response.totalPages);
            } else {
                setProjects([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProjectsContains = async (phrase, page = 0) => {
        try {
            setIsLoading(true);
            const body = { phrase };
            const endpoint = `/api/ogloszenie/contains?pageNumber=${page}&pageSize=${projectsPerPage}`;
            const response = await request(endpoint, "POST", body, false);

            if (response) {
                setProjects(response.content);
                setTotalPages(response.totalPages);
            } else {
                setProjects([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Failed to fetch search results:", err);
            setError("Failed to fetch search results");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCurrentUserAndFavorites = async () => {
        try {
            const user = await request("/api/users/current-user", "GET", null, true);
            setCurrentUser(user);

            const favoritesData = await request(
                `/api/users/ulubione/${user.id}`,
                "GET",
                null,
                true
            );
            setFavorites(favoritesData.map((favorite) => favorite.id));
        } catch (err) {
            console.warn("No user logged in or failed to fetch favorites:", err);
            setFavorites([]);
        } finally {
            setFavoritesLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUserAndFavorites();
        fetchProjects(0, null, null);
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            fetchProjects(currentPage, activeFilter, activeCategory);
        } else {
            fetchProjectsContains(searchTerm, currentPage);
        }
    }, [currentPage, activeFilter, activeCategory]);

    const handleFilter = (sortType) => {
        if (activeFilter === sortType) {
            setActiveFilter(null);
            setActiveCategory(null);
            setCurrentPage(0);
            if (searchTerm === "") {
                fetchProjects(0, null, null);
            } else {
                fetchProjectsContains(searchTerm, 0);
            }
        } else {
            setActiveCategory(null);
            setActiveFilter(sortType);
            setSearchTerm("");
            setCurrentPage(0);
            fetchProjects(0, sortType, null);
        }
    };

    const handleCategoryFilter = (category) => {
        if (activeCategory === category) {
            setActiveCategory(null);
            setActiveFilter(null);
            setCurrentPage(0);
            if (searchTerm === "") {
                fetchProjects(0, null, null);
            } else {
                fetchProjectsContains(searchTerm, 0);
            }
        } else {
            setActiveFilter(null);
            setActiveCategory(category);
            setSearchTerm("");
            setCurrentPage(0);
            fetchProjects(0, null, category);
        }
    };

    const handleSearchSubmit = async () => {
        setCurrentPage(0);
        if (searchTerm.trim() === "") {
            setActiveFilter(null);
            setActiveCategory(null);
            await fetchProjects(0, null, null);
        } else {
            setActiveFilter(null);
            setActiveCategory(null);
            await fetchProjectsContains(searchTerm, 0);
        }
    };

    const handlePagination = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPageNumbers = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        pageNumbers.push(
            <button
                key="prev"
                className={`pagination-button ${currentPage === 0 ? "disabled" : ""}`}
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage === 0}
            >
                Previous
            </button>
        );

        pageNumbers.push(
            <button
                key="first"
                className={`pagination-button ${currentPage === 0 ? "active" : ""}`}
                onClick={() => handlePagination(0)}
            >
                1
            </button>
        );

        if (currentPage > 1) {
            pageNumbers.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
        }

        if (currentPage > 0 && currentPage < totalPages - 1) {
            pageNumbers.push(
                <button
                    key="current"
                    className="pagination-button active"
                    onClick={() => handlePagination(currentPage)}
                >
                    {currentPage + 1}
                </button>
            );
        }

        if (currentPage < totalPages - 2) {
            pageNumbers.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
        }

        if (totalPages > 1) {
            pageNumbers.push(
                <button
                    key="last"
                    className={`pagination-button ${
                        currentPage === totalPages - 1 ? "active" : ""
                    }`}
                    onClick={() => handlePagination(totalPages - 1)}
                >
                    {totalPages}
                </button>
            );
        }

        pageNumbers.push(
            <button
                key="next"
                className={`pagination-button ${
                    currentPage === totalPages - 1 ? "disabled" : ""
                }`}
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                Next
            </button>
        );

        return pageNumbers;
    };

    if (isLoading || favoritesLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">Projects</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Posts"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                />
                <button onClick={handleSearchSubmit}>Search</button>
            </div>
            <div className="filter-buttons">
                <button
                    className={activeFilter === "desc" ? "active" : ""}
                    onClick={() => handleFilter("desc")}
                >
                    Newest
                </button>
                <button
                    className={activeFilter === "asc" ? "active" : ""}
                    onClick={() => handleFilter("asc")}
                >
                    Oldest
                </button>
                <button
                    className={activeFilter === "positive" ? "active" : ""}
                    onClick={() => handleFilter("positive")}
                >
                    Most liked
                </button>
                <button
                    className={activeFilter === "negative" ? "active" : ""}
                    onClick={() => handleFilter("negative")}
                >
                    Least Liked
                </button>
                <button
                    className={activeCategory === "ARDUINO" ? "active" : ""}
                    onClick={() => handleCategoryFilter("ARDUINO")}
                >
                    Arduino
                </button>
                <button
                    className={activeCategory === "RASPBERRY_PI" ? "active" : ""}
                    onClick={() => handleCategoryFilter("RASPBERRY_PI")}
                >
                    Raspberry Pi
                </button>
                <button
                    className={activeCategory === "OTHER" ? "active" : ""}
                    onClick={() => handleCategoryFilter("OTHER")}
                >
                    Other
                </button>
            </div>
            {projects.length === 0 && !isLoading && (
                <div>No projects available. Try a different filter or refresh.</div>
            )}
            <div>
                {projects.map((project) => (
                    <Link to={`/project/${project.id}`} key={project.id} target="_blank" rel="noopener noreferrer">
                        <ProjectCard
                            description={project.description}
                            photo={project.photo}
                            title={project.title}
                            projectId={project.id}
                            isFavorite={favorites.includes(project.id)}
                            addToFavorites={(id) =>
                                setFavorites((prev) => [...prev, id])
                            }
                            removeFromFavorites={(id) =>
                                setFavorites((prev) => prev.filter((fav) => fav !== id))
                            }
                        />
                    </Link>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    {renderPageNumbers()}
                </div>
            )}
        </div>
    );
};

export default ProjectFeed;
