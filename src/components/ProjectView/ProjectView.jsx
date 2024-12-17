import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProjectSteps from '../ProjectSteps/ProjectSteps';
import CommentSection from '../CommentSection/CommentSection';
import ShopRecommendations from '../ShopRecommendations/ShopRecommendations';
import './css/ProjectView.css';
import CodeBlockDisplay from "../CodeBlockDisplay/CodeBlockDisplay";
import Donate from "../Donate/Donate";
import Share from "../Share/Share";
import request from '../../services/api/Request.jsx';
import ProjectFiles from "../ProjectFiles/ProjectFiles.jsx";

const ProjectView = () => {
    const [project, setProject] = useState(null);
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [opinions, setOpinions] = useState({ positive: 0, negative: 0 });
    const [currentUser, setCurrentUser] = useState(null);
    const [userReaction, setUserReaction] = useState('none');

    const { id } = useParams();
    const navigate = useNavigate();

    const fetchProjectById = async () => {
        try {
            setLoading(true);
            const project = await request(`/api/ogloszenie/getById/${id}`, 'GET');
            setProject(project);
        } catch (err) {
            console.error("Failed to load project:", err);
            setError("Failed to load project. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSteps = async () => {
        try {
            const fetchedSteps = await request(`/api/steps/${id}`, 'GET');
            setSteps(fetchedSteps.sort((a, b) => a.stepNumber - b.stepNumber));
        } catch (err) {
            console.error("Failed to fetch steps:", err);
            setSteps([]);
        }
    };

    const fetchOpinions = async () => {
        try {
            const data = await request(`/api/ogloszenie/${id}/opinie`, 'GET', null, false);
            setOpinions(data || { positive: 0, negative: 0 });
        } catch (err) {
            console.error("Failed to fetch opinions:", err);
            setOpinions({ positive: 0, negative: 0 });
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const user = await request('/api/users/current-user', 'GET', null, true);
            setCurrentUser(user);
        } catch (err) {
            console.warn('No user logged in:', err);
            setCurrentUser(null);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchProjectById();
        fetchSteps();
        fetchOpinions();
    }, [id]);

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
            handleReactionRequest(0, 1, 0, 'none');
        } else {
            handleReactionRequest(0, 1, 0, 'dislike');
        }
    };

    const handleReportProject = async () => {
        if (!currentUser) {
            alert("You must be logged in to report a post.");
            return;
        }

        const title = prompt("Please provide a short title for your report (max 50 chars):");
        if (!title || title.trim() === "") return;

        const message = prompt("Please provide the details of your report (reason):");
        if (!message || message.trim() === "") return;

        const trimmedTitle = title.slice(0,50);
        const trimmedMessage = message.slice(0,3500);

        try {
            await request(`/api/report/post/${id}`, 'POST', { title: trimmedTitle, message: trimmedMessage }, true);
            alert("Post reported successfully.");
        } catch (err) {
            console.error("Failed to report post:", err);
            alert("Failed to report the post. Please try again later.");
        }
    };

    const renderContent = () => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!project) return <div>Project not found</div>;

        const reactionSum = opinions.positive - opinions.negative;

        return (
            <div className="project-view-container">
                <button onClick={() => navigate(-1)} className="close-button">X</button>
                <div className="project-header">
                    <div className="project-info">
                        <h1>{project.title || 'Untitled Project'}</h1>
                        {project.photo ? (
                            <img src={`data:image/png;base64,${project.photo}`} alt={project.title} className="project-image" />
                        ) : (
                            <img src="https://via.placeholder.com/150" alt="Placeholder" className="project-image" />
                        )}
                        <p className="project-description">{project.description || 'No description available'}</p>
                        <div className="project-details">
                            <span className="project-date">Author: {project.username}</span>
                            <span className="project-date">Date: {project.dataStworzenia ?
                                new Date(project.dataStworzenia).toISOString().split('T')[0]
                                : 'N/A'}
                            </span>
                            <span className="project-date">Category: {project.kategoria.charAt(0) + project.kategoria.slice(1).toLowerCase()}</span>
                            <div className="project-reactions">
                                <span className="reaction-sum">Likes: {reactionSum}</span>
                                {currentUser && (
                                    <>
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
                                    </>
                                )}
                                <Share />
                                {currentUser && (
                                    <button className="reaction-button" onClick={handleReportProject}>
                                        Report
                                    </button>
                                )}
                            </div>
                        </div>
                        <Donate link={project.donationLink} />
                        <ProjectFiles project={project} />
                        <ShopRecommendations items={project.requiredItems || []} />
                    </div>
                </div>
                <CodeBlockDisplay codeBlocks={project.kod || []} />
                <div className="project-steps">
                    <h3>Steps</h3>
                    <ProjectSteps steps={steps} />
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
