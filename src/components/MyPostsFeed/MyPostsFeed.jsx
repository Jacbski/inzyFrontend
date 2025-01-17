import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/auth/AuthContex";
import { Link } from "react-router-dom";
import MyProjectCard from "../MyProjectCard/MyProjectCard";
import request from "../../services/api/Request.jsx";
import "./css/MyPostsFeed.css";

const MyPostsFeed = () => {
    const { currentUser } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const projectsPerPage = 5;
    const navigate = useNavigate();

    const fetchUserProjects = async (page = 0) => {
        if (!currentUser) return;
        try {
            setIsLoading(true);
            const endpoint = `/api/ogloszenie/user/${currentUser.id}/ogloszenia?pageNumber=${page}&pageSize=${projectsPerPage}`;
            const response = await request(endpoint, "GET", null, true);

            if (response && response.content) {
                setProjects(response.content);
                setTotalPages(response.totalPages);
            } else {
                setProjects([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Failed to fetch user projects:", err);
            setError("Failed to fetch your projects.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUserProjects(currentPage);
        }
    }, [currentUser, currentPage]);


    const handlePagination = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleAddPostClick = () => {
        navigate("/add-post");
    };

    const renderPageNumbers = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        pageNumbers.push(
            <button
                key="first"
                className={`pagination-button ${currentPage === 0 ? "active" : ""}`}
                onClick={() => handlePagination(0)}
            >
                1
            </button>
        );

        if (currentPage > 1) {
            pageNumbers.push(
                <span key="ellipsis1" className="pagination-ellipsis">...</span>
            );
        }

        if (currentPage !== 0 && currentPage !== totalPages - 1) {
            pageNumbers.push(
                <button
                    key="current"
                    className="pagination-button active"
                    onClick={() => handlePagination(currentPage)}
                >
                    {currentPage + 1}
                </button>
            );
        }

        if (currentPage < totalPages - 2) {
            pageNumbers.push(
                <span key="ellipsis2" className="pagination-ellipsis">...</span>
            );
        }

        pageNumbers.push(
            <button
                key="last"
                className={`pagination-button ${
                    currentPage === totalPages - 1 ? "active" : ""
                }`}
                onClick={() => handlePagination(totalPages - 1)}
            >
                {totalPages}
            </button>
        );

        return pageNumbers;
    };

    const handleDelete = async (projectId) => {
        await fetchUserProjects(currentPage);
    };

    if (!currentUser) return <div style={{textAlign: "center"}}>Please log in to view your posts.</div>;
    if (isLoading) return <div style={{textAlign: "center"}}>Loading...</div>;
    if (error) return <div style={{textAlign: "center"}}>{error}</div>;

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">My Posts</h1>
            <div className="add-post-button-container">
                <button className="add-post-button" onClick={handleAddPostClick}>
                    Add Post
                </button>
            </div>
            {projects.length === 0 && !isLoading && (
                <div>No posts available. Create a new one!</div>
            )}
            <div>
                {projects.map((project) => (
                    <Link to={`/project/${project.id}`} key={project.id} target="_blank" rel="noopener noreferrer">
                        <MyProjectCard
                            key={project.id}
                            description={project.description}
                            photo={project.photo}
                            title={project.title}
                            projectId={project.id}
                            onDelete={() => handleDelete(project.id)}
                        />
                    </Link>
                ))}
            </div>
            <div className="pagination">
                <button
                    className={`pagination-button ${currentPage === 0 ? "disabled" : ""}`}
                    onClick={() => handlePagination(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                {renderPageNumbers()}
                <button
                    className={`pagination-button ${
                        currentPage === totalPages - 1 ? "disabled" : ""
                    }`}
                    onClick={() => handlePagination(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MyPostsFeed;
