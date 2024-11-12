// src/components/Feed/PostCard.jsx
import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <div className="flex items-center space-x-2">
        <img
          src={post.author.profilePicture || '/default-avatar.png'}
          alt="Author"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold">{post.author.username}</span>
      </div>
      <div className="mt-2">
        <p>{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post" className="mt-2 w-full h-auto rounded" />
        )}
      </div>
      <div className="mt-2 flex space-x-4 text-sm text-gray-600">
        <span>👍 {post.likes}</span>
        <span>💬 {post.comments.length}</span>
      </div>
    </div>
  );
};

export default PostCard;
