import React, { useState, useEffect } from 'react';
import './css/CommentSection.css';
import request from '../../services/api/Request.jsx';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

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

            const commentsWithUserDetails = await Promise.all(
                data.map(async (comment) => {
                    const user = await request(`/api/users/${comment.userID}`, 'GET', null, true);
                    return {
                        ...comment,
                        author: user?.userName || 'Unknown User',
                        isAuthor: currentUser?.id === comment.userID,
                    };
                })
            );

            setComments(commentsWithUserDetails || []);
        } catch (err) {
            setError('Failed to load comments. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId, currentUser]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const commentData = {
                    contents: newComment,
                    postID: postId,
                };

                const addedComment = await request(`/api/comments/${postId}`, 'POST', commentData, true);
                const user = await request(`/api/users/${addedComment.userID}`, 'GET', null, true);

                setComments([
                    {
                        ...addedComment,
                        author: user.userName,
                        isAuthor: currentUser?.id === addedComment.userID,
                    },
                    ...comments,
                ]);

                setNewComment('');
            } catch (err) {
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
    };

    const handleSaveEdit = async () => {
        const confirmed = window.confirm('Are you sure you want to save changes to this comment?');
        if (!confirmed) return;

        try {
            await request(`/api/comments/${editingCommentId}`, 'PUT', { contents: editingContent }, true);
            setEditingCommentId(null);
            setEditingContent('');
            setError(null);
            await fetchComments();
        } catch (err) {
            console.error('Failed to update comment:', err);
            setError('Failed to update comment. Please try again later.');
        }
    };

    return (
        <div className="comment-section">
            {currentUser && (
                <div className="add-comment">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment}>Add</button>
                </div>
            )}
            <h3>Comments</h3>
            {loading && <p>Loading comments...</p>}
            {error && <p className="error">{error}</p>}
            <div className="comments">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="avatar">{comment.author ? comment.author[0] : 'A'}</div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="comment-author">{comment.author || 'Anonymous'}</span>
                                <span className="comment-date">
                                    {new Date(comment.creationDate).toLocaleDateString() || 'Unknown date'}
                                </span>
                            </div>
                            {editingCommentId === comment.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                    />
                                    <button onClick={handleSaveEdit}>Save</button>
                                    <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <p className="comment-text">{comment.contents}</p>
                            )}
                            {currentUser && comment.isAuthor && (
                                <div className="comment-actions">
                                    <button onClick={() => handleEditComment(comment.id, comment.contents)}>Edit</button>
                                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
