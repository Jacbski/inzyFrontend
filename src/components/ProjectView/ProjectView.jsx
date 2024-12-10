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
import request from '../../services/api/Request.jsx';

const ProjectView = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [opinions, setOpinions] = useState({ positive: 0, negative: 0 });
    const [userReaction, setUserReaction] = useState('none');

    const { id } = useParams();
    const navigate = useNavigate();

    const fetchOpinions = async () => {
        try {
            const data = await request(`/api/ogloszenie/${id}/opinie`, 'GET', null, false);
            if (!data) {
                setOpinions({ positive: 0, negative: 0 });
                return;
            }
            setOpinions(data);
        } catch (err) {
            console.error("Failed to fetch opinions:", err);
            setOpinions({ positive: 0, negative: 0 });
        }
    };

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
                } else {
                    navigate('/');
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load project. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
        fetchOpinions();
    }, [id, navigate]);

    const handleReactionRequest = async (positive, negative, none, newReaction) => {
        try {
            await request(`/api/opinie/${id}/dodaj`, 'POST', { positive, negative, none }, true);
            await fetchOpinions();
            setUserReaction(newReaction);
        } catch (err) {
            console.error("Error submitting opinion:", err);
        }
    };

    const handleLike = () => {
        if (userReaction === 'like') {
            handleReactionRequest(0, 0, 1, 'none');
        } else {
            handleReactionRequest(1, 0, 0, 'like');
        }
    };

    const handleDislike = () => {
        if (userReaction === 'dislike') {
            handleReactionRequest(0, 0, 1, 'none');
        } else {
            handleReactionRequest(0, 1, 0, 'dislike');
        }
    };

    const handleDownload = (fileName) => {
        console.log(`Downloading ${fileName}`);
    };

    const renderContent = () => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!project) return <div>Project not found</div>;

        const reactionSum = opinions.positive - opinions.negative;

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
                        )}
                        <p className="project-description">{project.description || 'No description available'}</p>
                        <div className="project-details">
                            <span className="project-date">Created: {project.dataStworzenia || 'N/A'}</span>
                            <div className="project-reactions">
                                <span className="reaction-sum">{reactionSum}</span>
                                <button
                                    className={`reaction-button like-button ${userReaction === 'like' ? 'active' : ''}`}
                                    onClick={handleLike}>
                                    Like
                                </button>
                                <button
                                    className={`reaction-button dislike-button ${userReaction === 'dislike' ? 'active' : ''}`}
                                    onClick={handleDislike}>
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
