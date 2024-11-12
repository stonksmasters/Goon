// src/components/Feed/CommentSection.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    try {
      const response = await axios.post(`/api/feed/${postId}/comments`, { comment: newComment });
      // Update comments locally or refetch
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold">Comments</h4>
      <div className="mt-2 space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-2">
            <img
              src={comment.author.profilePicture || '/default-avatar.png'}
              alt="Commenter"
              className="w-6 h-6 rounded-full"
            />
            <div>
              <span className="font-semibold">{comment.author.username}</span>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
