import React, { useState } from 'react';
import './css/CommentSection.css';

export default function CommentSection() {
    const [comments, setComments] = useState([
        {
            author: "John Doe",
            text: "Great project! Really helpful.",
            date: "2024-10-21",
        },
        {
            author: "Jane Smith",
            text: "I had some issues with step 3, can anyone help?",
            date: "2024-10-20",
        },
        {
            author: "Alex Johnson",
            text: "Fantastic guide, thanks for sharing!",
            date: "2024-10-19",
        }
    ]);

    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment = {
                author: "Current User",
                text: newComment,
                date: new Date().toISOString().split('T')[0]
            };
            setComments([comment, ...comments]);
            setNewComment("");
        }
    };

    return (
        <div className="comment-section">
            <div className="add-comment">
                <div className="avatar">C</div>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAddComment}>Add</button>
            </div>
            <h3>Comments</h3>
            <div className="comments">
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <div className="avatar">{comment.author[0]}</div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="comment-author">{comment.author}</span>
                                <span className="comment-date">{comment.date}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}