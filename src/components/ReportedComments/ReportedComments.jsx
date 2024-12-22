import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../services/auth/AuthContex";
import request from "../../services/api/Request";
import "./css/ReportedComments.css";

const ReportedComments = () => {
  const { currentUser } = useContext(AuthContext);

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const commentsPerPage = 5;

  const fetchComments = async (page = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = `/api/admin/comments?pageNumber=${page}&pageSize=${commentsPerPage}`;
      const response = await request(endpoint, "GET", null, true);

      if (response && response.content) {
        setReports(response.content);
        setTotalPages(response.totalPages);
      } else {
        setReports([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Failed to fetch reported comments:", err);
      setError("Failed to fetch reported comments.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userID) => {
    const confirmBan = window.confirm(
      `Are you sure you want to ban user with ID: ${userID}?`
    );
    if (!confirmBan) return;

    try {
      await request(`/api/admin/ban/${userID}`, "PUT", null, true);
      alert(`User with ID '${userID}' has been banned successfully!`);
      // W razie potrzeby możesz np. odświeżyć listę:
      // fetchComments(currentPage);
    } catch (err) {
      console.error("Failed to ban user:", err);
      alert("Failed to ban user.");
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === "ADMIN") {
      fetchComments(currentPage);
    }
  }, [currentUser, currentPage]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="reported-comments-wrapper">
        <div>You do not have permission to view this page.</div>
      </div>
    );
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
      pageNumbers.push(
        <span key="ellipsis1" className="pagination-ellipsis">
          ...
        </span>
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
        <span key="ellipsis2" className="pagination-ellipsis">
          ...
        </span>
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="reported-comments-wrapper">
      <h1 className="reported-comments-title">Reported Comments</h1>

      {reports.length === 0 && !isLoading && (
        <div>No reported comments available.</div>
      )}

      <div className="comments-list">
        {reports.map((report) => (
          <div key={report.messageID} className="comment-report-card">
            <div className="report-details">
              <h2 className="report-title">{report.title}</h2>
              <p className="report-message">{report.message}</p>
              <p className="report-user">
                <strong>Reported By:</strong> {report.userName}
              </p>
            </div>

            {report.commentDto && (
              <div className="comment-details">
                <p>
                  <strong>Comment ID:</strong> {report.commentDto.id}
                </p>
                <p>
                  <strong>Contents:</strong> {report.commentDto.contents}
                </p>
                <p>
                  <strong>Author's User ID:</strong> {report.commentDto.userID}
                </p>
                <p>
                  <strong>Post ID:</strong> {report.commentDto.postID}
                </p>
                <p>
                  <strong>Created at:</strong> {report.commentDto.creationDate}
                </p>

                {report.commentDto.userID && (
                  <button
                    className="ban-button"
                    onClick={() => handleBanUser(report.commentDto.userID)}
                  >
                    Ban User
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className={`pagination-button ${
              currentPage === 0 ? "disabled" : ""
            }`}
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
      )}
    </div>
  );
};

export default ReportedComments;
