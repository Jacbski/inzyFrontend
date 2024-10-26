import React, { useState, useEffect } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import './css/ProjectFeed.css';

const ProjectFeed = ({ onProjectClick }) => {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const projectsPerPage = 5;

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/ogloszenie/getAll');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProjects(data);
            setIsLoading(false);
        } catch (error) {
            setError('Failed to fetch projects');
            setIsLoading(false);
        }
    };

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleFavorite = (projectId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(projectId)
                ? prevFavorites.filter((id) => id !== projectId)
                : [...prevFavorites, projectId]
        );
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">Projects</h1>
            <div>
                {currentProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        description={project.opis}
                        thumbnail="/placeholder.svg?height=150&width=150"
                        title={project.title}
                        trends={project.opinia ? project.opinia.positive - project.opinia.negative : 0}
                        isFavorite={favorites.includes(project.id)}
                        onFavoriteToggle={() => toggleFavorite(project.id)}
                        onClick={() => onProjectClick(project)}
                    />
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