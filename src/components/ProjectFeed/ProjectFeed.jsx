import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../ProjectCard/ProjectCard';
import './css/ProjectFeed.css';
import request from '../../services/api/Request.jsx';

const ProjectFeed = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const projectsPerPage = 5;

    const fetchProjects = async (page = 0, sortEndpoint = '') => {
        try {
            setIsLoading(true);
            const endpoint = sortEndpoint
                ? `/api/ogloszenie/sorted/${sortEndpoint}?pageNumber=${page}&pageSize=${projectsPerPage}`
                : `/api/ogloszenie/getAll?pageNumber=${page}&pageSize=${projectsPerPage}`;
            const response = await request(endpoint, 'GET', null, false);

            if (response && response.length > 0) {
                setProjects(response);
                setHasNextPage(response.length === projectsPerPage);
            } else {
                setHasNextPage(false);
            }
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            setError('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCurrentUserAndFavorites = async () => {
        try {
            const user = await request('/api/users/current-user', 'GET', null, true);
            setCurrentUser(user);

            const favoritesData = await request(`/api/users/ulubione/${user.id}`, 'GET', null, true);
            setFavorites(favoritesData.map((favorite) => favorite.id)); // Only store favorite IDs
        } catch (err) {
            console.warn('No user logged in or failed to fetch favorites:', err);
        }
    };

    // Load data on initial mount
    useEffect(() => {
        fetchCurrentUserAndFavorites();
    }, []);

    useEffect(() => {
        fetchProjects(currentPage, activeFilter);
    }, [currentPage, activeFilter]);

    const handleFilter = (sortType) => {
        if (sortType !== activeFilter) {
            setActiveFilter(sortType);
            setCurrentPage(0);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        if (value.trim() === '') {
            fetchProjects(0, activeFilter);
        } else {
            // Perform local search
            const filtered = projects.filter((project) =>
                project.description.toLowerCase().includes(value)
            );
            setProjects(filtered);
            setHasNextPage(false);
        }
    };

    const handlePagination = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
        }
    };

    if (isLoading && currentPage === 0) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">Projects</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Posts"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button>Search</button>
            </div>
            <div className="filter-buttons">
                <button
                    className={activeFilter === 'asc' ? 'active' : ''}
                    onClick={() => handleFilter('asc')}
                >
                    Sort by Date Asc
                </button>
                <button
                    className={activeFilter === 'desc' ? 'active' : ''}
                    onClick={() => handleFilter('desc')}
                >
                    Sort by Date Desc
                </button>
                <button
                    className={activeFilter === 'positive' ? 'active' : ''}
                    onClick={() => handleFilter('positive')}
                >
                    Sort by Positive Score
                </button>
                <button
                    className={activeFilter === 'negative' ? 'active' : ''}
                    onClick={() => handleFilter('negative')}
                >
                    Sort by Negative Score
                </button>
            </div>
            {currentUser && (
                <div className="add-project">
                    <Link to="/add-post">
                        <button>Add Project</button>
                    </Link>
                </div>
            )}
            {projects.length === 0 && !isLoading && (
                <div>No projects available. Try a different filter or refresh.</div>
            )}
            <div>
                {projects.map((project) => (
                    <Link to={`/project/${project.id}`} key={project.id}>
                        <ProjectCard
                            description={project.description}
                            photo={project.photo}
                            title={project.title}
                            projectId={project.id}
                            isFavorite={favorites.includes(project.id)} // Pass favorite status
                            addToFavorites={(id) => setFavorites((prev) => [...prev, id])} // Handle adding to favorites
                            disableFavorite={!currentUser} // Disable favorite button if no user logged in
                        />
                    </Link>
                ))}
            </div>
            <div className="pagination">
                <button
                    className={`pagination-button ${currentPage === 0 ? 'disabled' : ''}`}
                    onClick={() => handlePagination(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                <span className="pagination-info">Page {currentPage + 1}</span>
                <button
                    className={`pagination-button ${!hasNextPage ? 'disabled' : ''}`}
                    onClick={() => handlePagination(currentPage + 1)}
                    disabled={!hasNextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProjectFeed;
