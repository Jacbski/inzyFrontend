import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProjectSteps from '../ProjectSteps/ProjectSteps';
import CommentSection from '../CommentSection/CommentSection';
import ShopRecommendations from '../ShopRecommendations/ShopRecommendations';
import { fetchProjects } from '../../data';
import './css/ProjectView.css';
import CodeBlockDisplay from "../CodeBlockDisplay/CodeBlockDisplay";
import Donate from "../Donate/Donate";
import Share from "../Share/Share";

const ProjectView = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reactionSum, setReactionSum] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                const projects = await fetchProjects();

                if (!Array.isArray(projects)) {
                    throw new Error("Fetched data is not an array");
                }

                const foundProject = projects.find(p => p.id === id);

                if (foundProject) {
                    setProject(foundProject);
                    const initialReactionSum = Array.isArray(foundProject.opinia)
                        ? foundProject.opinia.reduce((total, opinion) =>
                            total + (Number(opinion.positive) || 0) + (Number(opinion.negative) || 0), 0)
                        : 0;
                    setReactionSum(initialReactionSum);
                } else {
                    navigate('/');
                }
            } catch (err) {
                setError("Failed to load project. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [id, navigate]);

    const handleLike = () => {
        setReactionSum(prevSum => prevSum + 1);
    };

    const handleDislike = () => {
        setReactionSum(prevSum => prevSum - 1);
    };

    const handleDownload = (fileName) => {
        console.log(`Downloading ${fileName}`);
    };

    const renderContent = () => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!project) return <div>Project not found</div>;


        return (
            <div className="project-view-container">
                <Link to="/" className="close-button">X</Link>
                <div className="project-header">
                    <div className="project-info">
                        <h1>{project.title || 'Untitled Project'}</h1>
                        {project.photo ? (
                            <img src={`data:image/png;base64,${project.photo}`} alt={project.title} className="project-image"/>
                        ) : (
                            <img src="https://via.placeholder.com/150" alt="Placeholder" className="project-image"/>
                        )}                        <p className="project-description">{project.description || 'No description available'}</p>
                        <div className="project-details">
                            <span className="project-date">Created: {project.dataStworzenia || 'N/A'}</span>
                            <div className="project-reactions">
                                <span className="reaction-sum">{reactionSum}</span>
                                <button className="reaction-button like-button" onClick={handleLike}>
                                    Like
                                </button>
                                <button className="reaction-button dislike-button" onClick={handleDislike}>
                                    Dislike
                                </button>
                                <Share />
                            </div>
                        </div>
                        <Donate link={project.link} projectId={project.id} />
                        <div className="project-files">
                            <h4>Attached Files:</h4>
                            {project.files && project.files.length > 0 ? (
                                <ul className="file-list">
                                    {project.files.map((file, index) => (
                                        <li key={index} className="file-item">
                                            <span className="file-icon">📄</span>
                                            <span className="file-name">{file}</span>
                                            <span
                                                className="download-text"
                                                onClick={() => handleDownload(file)}
                                            >
                                                Download
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No files attached</p>
                            )}
                        </div>
                        <ShopRecommendations items={project.requiredItems || []} />
                    </div>
                </div>
                <CodeBlockDisplay codeBlocks={project.kod || []} />
                <div className="project-steps">
                    <h3>Steps</h3>
                    <ProjectSteps steps={project.steps || []} />
                </div>
                <CommentSection postId={project.id} />

            </div>
        );
    };

    return (
        <div className="project-view-wrapper">
            {renderContent()}
        </div>
    );
};

export default ProjectView;