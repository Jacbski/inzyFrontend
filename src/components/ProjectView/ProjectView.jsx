import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectSteps from '../ProjectSteps/ProjectSteps';
import CommentSection from '../CommentSection/CommentSection';
import ShopRecommendations from '../ShopRecommendations/ShopRecommendations'
import { mockProjects } from '../../data';
import './css/ProjectView.css';
import CodeBlockDIsplay from "../CodeBlockDisplay/CodeBlockDIsplay.jsx";
import Donate from "../Donate/Donate.jsx";
import Share from "../Share/Share.jsx";


const ProjectView = () => {
    const [project, setProject] = useState(null);
    const [reactionSum, setReactionSum] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const projectId = parseInt(id);
        const foundProject = mockProjects.find(p => p.id === projectId);
        if (foundProject) {
            setProject(foundProject);
            setReactionSum(foundProject.trends);
        } else {
            navigate('/');
        }
    }, [id, navigate]);

    if (!project) return null;

    const handleDownload = (fileName) => {
        console.log(`Downloading ${fileName}`);
    };

    const handleLike = () => {
        setReactionSum(prevSum => prevSum + 1);
    };

    const handleDislike = () => {
        setReactionSum(prevSum => prevSum - 1);
    };

    return (
        <div className="project-view-wrapper">
            <div className="project-view-container">
                <button className="close-button" onClick={() => navigate('/')}>X</button>
                <div className="project-header">
                    <div className="project-info">
                        <h1>{project.title}</h1>
                        <img src={project.thumbnail} alt={project.title} className="project-image"/>
                        <p className="project-description">{project.description}</p>
                        <div className="project-details">
                            <span className="project-date">Created: {project.date || 'N/A'}</span>
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
                                            <span className="file-name">{file.name}</span>
                                            <span
                                                className="download-text"
                                                onClick={() => handleDownload(file.name)}
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
                        <ShopRecommendations items={project.requiredItems} />
                    </div>
                </div>
                <CodeBlockDIsplay codeBlocks={project.codeBlocks || []} />
                <div className="project-steps">
                    <h3>Steps</h3>
                    <ProjectSteps steps={project.steps || []} />
                </div>
                <CommentSection comments={project.comments || []} />
            </div>
        </div>
    );
};

export default ProjectView;