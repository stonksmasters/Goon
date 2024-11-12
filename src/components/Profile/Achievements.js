// src/components/Profile/Achievements.jsx
import React from 'react';

const Achievements = ({ badges }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">Achievements</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {badges.map((badge) => (
          <div key={badge.id} className="flex items-center space-x-2 bg-gray-200 p-2 rounded">
            <img src={badge.icon} alt={badge.name} className="w-6 h-6" />
            <span>{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
