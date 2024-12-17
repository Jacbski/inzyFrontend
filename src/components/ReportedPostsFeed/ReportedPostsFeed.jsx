import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../services/auth/AuthContex";
import { Link } from "react-router-dom";
import request from "../../services/api/Request.jsx";
import ReportedProjectCard from "../ReportedProjectCard/ReportedProjectCard";
import './css/ReportedPostsFeed.css';

const ReportedPostsFeed = () => {
    const { currentUser } = useContext(AuthContext);
    const [reportedPosts, setReportedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const projectsPerPage = 5;

    const fetchReportedPosts = async (page = 0) => {
        try {
            setIsLoading(true);
            const endpoint = `/api/admin/posts?pageNumber=${page}&pageSize=${projectsPerPage}`;
            const response = await request(endpoint, "GET", null, true);

            if (response && response.content) {
                setReportedPosts(response.content);
                setTotalPages(response.totalPages);
            } else {
                setReportedPosts([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Failed to fetch reported posts:", err);
            setError("Failed to fetch reported posts.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.role === "ADMIN") {
            fetchReportedPosts(currentPage);
        }
    }, [currentUser, currentPage]);

    if (!currentUser || currentUser.role !== "ADMIN") {
        return(
        <div className="project-feed">
            <div>You do not have permission to view this page.</div>;
        </div>);
    }

    const handlePagination = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
        }
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
            pageNumbers.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
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
            pageNumbers.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
        }

        pageNumbers.push(
            <button
                key="last"
                className={`pagination-button ${currentPage === totalPages - 1 ? "active" : ""}`}
                onClick={() => handlePagination(totalPages - 1)}
            >
                {totalPages}
            </button>
        );

        return pageNumbers;
    };

    const handleDelete = async (projectId) => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        try {
            await request(`/api/ogloszenie/deleteOgloszenie/${projectId}`, "DELETE", null, true);
            fetchReportedPosts(currentPage);
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("Failed to delete the post.");
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="project-feed">
            <h1 className="project-feed-title">Reported Posts</h1>
            {reportedPosts.length === 0 && !isLoading && (
                <div>No reported posts available.</div>
            )}
            <div>
                {reportedPosts.map((report) => (
                    <ReportedProjectCard
                        key={report.messageID}
                        report={report}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            {totalPages > 1 && (
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
                        className={`pagination-button ${currentPage === totalPages - 1 ? "disabled" : ""}`}
                        onClick={() => handlePagination(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportedPostsFeed;
