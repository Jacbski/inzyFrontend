import React, { useEffect, useState } from "react";
import "./css/MyProjectCard.css";
import request from "../../services/api/Request.jsx";

const MyProjectCard = ({ photo, title, description, projectId, onDelete }) => {
    const [opinionSum, setOpinionSum] = useState(0);

    useEffect(() => {
        const fetchOpinions = async () => {
            try {
                const data = await request(
                    `/api/ogloszenie/${projectId}/opinie`,
                    "GET",
                    null,
                    false
                );
                setOpinionSum((data?.positive || 0) - (data?.negative || 0));
            } catch (err) {
                console.error("Failed to fetch opinions:", err);
            }
        };

        fetchOpinions();
    }, [projectId]);

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await request(`/api/ogloszenie/deleteOgloszenie/${projectId}`, "DELETE", null, true);
            onDelete();
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("Failed to delete the post. Please try again.");
        }
    };

    const getLikesScoreClass = () => {
        if (opinionSum > 0) return "likes-positive";
        if (opinionSum < 0) return "likes-negative";
        return "likes-neutral";
    };

    return (
        <div className="project-card">
            <div className="thumbnail-container">
                <img
                    src={
                        photo
                            ? `data:image/png;base64,${photo}`
                            : "https://via.placeholder.com/150"
                    }
                    className="thumbnail"
                    alt={title || "Project thumbnail"}
                />
                <div className={`likes-info ${getLikesScoreClass()}`}>
                    <span className="likes-score">{opinionSum}</span>
                </div>
            </div>
            <div className="card-content">
                <div className="project-title">{title}</div>
                <p className="body-text">{description}</p>
            </div>
            <div className="favorites-wrapper">
                <button
                    aria-label="Delete Post"
                    className="remove-button"
                    onClick={handleDeleteClick}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default MyProjectCard;
