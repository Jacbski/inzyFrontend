import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../ProjectCard/ProjectCard';
import './css/ProjectFeed.css';
import {mockProjects} from "../../data.js";

const ProjectFeed = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const projectsPerPage = 5;
    const totalPages = Math.ceil(mockProjects.length / projectsPerPage);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = mockProjects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleFavorite = (projectId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(projectId)
                ? prevFavorites.filter((id) => id !== projectId)
                : [...prevFavorites, projectId]
        );
    };

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">Projects</h1>
            <div>
                {currentProjects.map((project) => (
                    <Link to={`/project/${project.id}`} key={project.id}>
                        <ProjectCard
                            description={project.description}
                            thumbnail={project.thumbnail}
                            title={project.title}
                            trends={project.trends}
                            isFavorite={favorites.includes(project.id)}
                            onFavoriteToggle={() => toggleFavorite(project.id)}
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