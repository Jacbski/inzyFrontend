import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../ProjectCard/ProjectCard';
import './css/ProjectFeed.css';
import { fetchProjects } from '../../data';

const ProjectFeed = () => {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const projectsPerPage = 5;

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const fetchedProjects = await fetchProjects();
                setProjects(fetchedProjects);
            } catch (error) {
                setError('Failed to fetch projects');
            } finally {
                setIsLoading(false);
            }
        };
        loadProjects();
    }, []);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">Projects</h1>
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
