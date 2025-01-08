import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../services/auth/AuthContex";
import request from "../../services/api/Request";
import "./css/ContactFormMessages.css";

const ContactFormMessages = () => {
  const { currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const messagesPerPage = 5;

  const fetchMessages = async (page = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = `/api/admin/messages?pageNumber=${page}&pageSize=${messagesPerPage}`;
      const response = await request(endpoint, "GET", null, true);

      if (response && response.content) {
        setMessages(response.content);
        setTotalPages(response.totalPages);
      } else {
        setMessages([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Failed to fetch contact form messages:", err);
      setError("Failed to fetch contact form messages.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = async (messageID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    try {
      await request(`/api/admin/messages/${messageID}`, "DELETE", null, true);

      fetchMessages(currentPage);
    } catch (err) {
      console.error("Failed to delete the message:", err);
      alert("Failed to delete the message.");
    }
  };

  const handleBanUser = async (userID) => {
    if (!userID) {
      alert("Cannot ban user: userID is missing.");
      return;
    }
    const confirmBan = window.confirm(
      `Are you sure you want to ban user with ID: ${userID}?`
    );
    if (!confirmBan) return;

    try {
      await request(`/api/admin/ban/${userID}`, "PUT", null, true);
      alert(`User with ID '${userID}' has been banned successfully!`);
      // W razie potrzeby możesz ponownie wczytać wiadomości:
      // fetchMessages(currentPage);
    } catch (err) {
      console.error("Failed to ban user:", err);
      alert("Failed to ban user.");
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === "ADMIN") {
      fetchMessages(currentPage);
    }
  }, [currentUser, currentPage]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="messages-wrapper">
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
    <div className="messages-wrapper">
      <h1 className="messages-title">Contact Form Messages</h1>

      {messages.length === 0 && !isLoading && <div>No messages available.</div>}

      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.messageID} className="message-card">
            <h2 className="message-title">{msg.title}</h2>
            <p className="message-content">{msg.message}</p>
            <p className="message-user">
              <strong>User:</strong> {msg.userName}
            </p>
            <p className="message-userid">
              <strong>UserID:</strong> {msg.userID}
            </p>

            <button
              className="delete-button"
              onClick={() => handleDeleteMessage(msg.messageID)}
            >
              Delete
            </button>

            {msg.userID && (
              <button
                className="ban-button"
                onClick={() => handleBanUser(msg.userID)}
              >
                Ban User
              </button>
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

export default ContactFormMessages;
