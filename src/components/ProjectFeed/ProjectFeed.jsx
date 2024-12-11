import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../ProjectCard/ProjectCard';
import './css/ProjectFeed.css';
import request from '../../services/api/Request.jsx';

const ProjectFeed = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const projectsPerPage = 5;

    const fetchProjects = async (sortEndpoint = '') => {
        try {
            const endpoint = sortEndpoint
                ? `/api/ogloszenie/sorted/${sortEndpoint}`
                : '/api/ogloszenie/getAll';
            const fetchedProjects = await request(endpoint, 'GET', null, false);
            setProjects(fetchedProjects);
            setFilteredProjects(fetchedProjects);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            setError('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFilter = (sortType) => {
        setIsLoading(true);
        if (activeFilter === sortType) {
            setActiveFilter(null);
            fetchProjects();
        } else {
            setActiveFilter(sortType);
            fetchProjects(sortType);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        if (value.trim() === '') {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter((project) =>
                project.description.toLowerCase().includes(value)
            );
            setFilteredProjects(filtered);
        }
    };

    if (isLoading) return <div>Loading...</div>;
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
                    Sort by Date Dsc
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
            {currentProjects.length === 0 && (
                <div>No projects available. Try a different filter or refresh.</div>
            )}
            <div>
                {currentProjects.map((project) => (
                    <Link to={`/project/${project.id}`} key={project.id}>
                        <ProjectCard
                            description={project.description}
                            photo={project.photo}
                            title={project.title}
                            projectId={project.id}
                        />
                    </Link>
                ))}
            </div>
            <div className="pagination">
                <button
                    className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </button>
                ))}
                <button
                    className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProjectFeed;
