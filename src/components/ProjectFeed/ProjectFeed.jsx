import React, { useState } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import './css/ProjectFeed.css';

const mockProjects = Array(20).fill(null).map((_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    description: 'This is a sample project description. It can contain details about the project, its goals, and its current status.',
    thumbnail: `/src/assets/dekler-ph-OSk8nBHR21Q-unsplash.jpg`,
    trends: Math.floor(Math.random() * 100) + 1,
    date: '2024-10-22',
    files: [
        { name: `File${i + 1}.pdf` },
        { name: `Documentation${i + 1}.docx` }
    ],
    steps: [
        {
            image: `/src/assets/dekler-ph-OSk8nBHR21Q-unsplash.jpg`,
            description: `This is the description for step 1 of Project ${i + 1}`
        },
        {
            image: `/src/assets/dekler-ph-OSk8nBHR21Q-unsplash.jpg`,
            description: `This is the description for step 2 of Project ${i + 1}`
        }
    ],
    comments: [
        {
            author: 'John Doe',
            text: `Great project! I learned a lot from Project ${i + 1}.`,
            date: '2024-10-21'
        },
        {
            author: 'Jane Smith',
            text: `I'm having trouble with step 2 on Project ${i + 1}. Any advice?`,
            date: '2024-10-20'
        }
    ]
}));

const ProjectFeed = ({ onProjectClick }) => {
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
                    <ProjectCard
                        key={project.id}
                        description={project.description}
                        thumbnail={project.thumbnail}
                        title={project.title}
                        trends={project.trends}
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
