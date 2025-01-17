import React, { useState, useEffect } from 'react';
import './css/CommentSection.css';
import request from '../../services/api/Request.jsx';
import ReportModal from '../ReportModal/ReportModal';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [userCache, setUserCache] = useState({});
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [validationError, setValidationError] = useState('');
    const [editValidationError, setEditValidationError] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [commentToReport, setCommentToReport] = useState(null);

    const MAX_COMMENT_LENGTH = 500;

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await request('/api/users/current-user', 'GET', null, true);
                setCurrentUser(user);
            } catch (err) {
                console.warn('No user logged in:', err);
            }
        };

        fetchCurrentUser();
    }, []);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await request(`/api/comments?postID=${postId}`, 'GET', null, true);
            setComments(data || []);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
            setError('Failed to load comments. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchUserById = async (userId) => {
        if (userCache[userId]) return userCache[userId];

        try {
            const user = await request(`/api/users/${userId}`, 'GET', null, true);
            setUserCache((prevCache) => ({ ...prevCache, [userId]: user }));
            return user;
        } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err);
            return { userName: 'Anonymous', avatar: null };
        }
    };

    const getUserById = (userId) => {
        return userCache[userId] || { userName: 'Loading...', avatar: null };
    };

    useEffect(() => {
        const preloadUsers = async () => {
            const userIds = [...new Set(comments.map((comment) => comment.userID))];
            for (const userId of userIds) {
                if (!userCache[userId]) {
                    await fetchUserById(userId);
                }
            }
        };

        preloadUsers();
    }, [comments]);

    const handleAddComment = async () => {
        if (newComment.trim().length > MAX_COMMENT_LENGTH) {
            setValidationError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`);
            return;
        }

        if (newComment.trim()) {
            try {
                const commentData = {
                    contents: newComment,
                    postID: postId,
                };

                const addedComment = await request(`/api/comments/${postId}`, 'POST', commentData, true);
                setComments([addedComment, ...comments]);
                setNewComment('');
                setValidationError('');
            } catch (err) {
                console.error('Failed to add comment:', err);
                setError('Failed to add comment. Please try again later.');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm('Are you sure you want to delete this comment?');
        if (!confirmed) return;

        try {
            await request(`/api/comments/${commentId}`, 'DELETE', null, true);
            setComments(comments.filter((comment) => comment.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditingContent(content);
        setEditValidationError('');
    };

    const handleSaveEdit = async () => {
        if (editingContent.trim().length > MAX_COMMENT_LENGTH) {
            setEditValidationError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`);
            return;
        }

        const confirmed = window.confirm('Are you sure you want to save changes to this comment?');
        if (!confirmed) return;

        try {
            await request(`/api/comments/${editingCommentId}`, 'PUT', { contents: editingContent }, true);
            setEditingCommentId(null);
            setEditingContent('');
            setEditValidationError('');
            setError(null);
            await fetchComments();
        } catch (err) {
            console.error('Failed to update comment:', err);
            setError('Failed to update comment. Please try again later.');
        }
    };

    const handleReportComment = (commentId) => {
        if (!currentUser) {
            alert("You must be logged in to report a comment.");
            return;
        }
        setCommentToReport(commentId);
        setShowReportModal(true);
    };

    const submitCommentReport = async (title, message) => {
        if (!commentToReport) return;
        try {
            await request(`/api/report/comment/${commentToReport}`, 'POST', { title, message }, true);
            setShowReportModal(false);
            setCommentToReport(null);
        } catch (err) {
            console.error("Failed to report comment:", err);
            alert("Failed to report the comment. Please try again later.");
        }
    };

    return (
        <div className="comment-section">
            {currentUser && (
                <div className="add-comment">
                    <input
                        type="text"
                        placeholder="Add comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>+</button>
                    <div className="comment-validation">
                        {newComment.length}/{MAX_COMMENT_LENGTH}
                        {validationError && <p className="error">{validationError}</p>}
                    </div>
                </div>
            )}
            <h3>Comments</h3>
            {loading && <p>Loading comments...</p>}
            {error && <p className="error">{error}</p>}
            {comments.length !== 0 &&
            <div className="comments">
                {comments.map((comment) => {
                    const user = getUserById(comment.userID);
                    return (
                        <div key={comment.id} className="comment">
                            <div className="avatar">
                                <img
                                    src={
                                        user.avatar
                                            ? `data:image/jpeg;base64,${user.avatar}`
                                            : 'https://via.placeholder.com/150'
                                    }
                                    alt={user.userName}
                                    className="avatar-img"
                                />
                            </div>
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="comment-author">{user.userName}</span>
                                    <span className="comment-date">
                                        {new Date(comment.creationDate).toLocaleDateString()}
                                    </span>
                                </div>
                                {editingCommentId === comment.id ? (
                                    <div className="edit-comment">
                                        <input
                                            type="text"
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                        />
                                        <div className="comment-validation">
                                            {editingContent.length}/{MAX_COMMENT_LENGTH}
                                            {editValidationError && <p className="error">{editValidationError}</p>}
                                        </div>
                                        <div className="edit-actions">
                                            <button onClick={handleSaveEdit}>Save</button>
                                            <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="comment-text">{comment.contents}</p>
                                        <div className="comment-actions">
                                            {currentUser && currentUser.id === comment.userID && (
                                                <>
                                                    <button
                                                        className="action-button"
                                                        onClick={() => handleEditComment(comment.id, comment.contents)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="action-button"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                            {currentUser && (
                                                <button
                                                    className="action-button"
                                                    onClick={() => handleReportComment(comment.id)}
                                                >
                                                    Report
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>}
            {comments.length === 0 && !loading && <p>No comments yet.</p>}
            {showReportModal && (
                <ReportModal
                    onClose={() => {
                        setShowReportModal(false);
                        setCommentToReport(null);
                    }}
                    onSubmit={submitCommentReport}
                />
            )}
        </div>
    );
}
