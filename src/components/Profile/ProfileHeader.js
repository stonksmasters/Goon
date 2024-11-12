// src/components/Profile/ProfileHeader.jsx
import React from 'react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={user.profilePicture || '/default-avatar.png'}
        alt="Profile"
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h2 className="text-2xl font-bold">{user.username}</h2>
        <p className="text-gray-600">Member since {new Date(user.joined).getFullYear()}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
