// src/pages/CouncilPage.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const CouncilPage = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  const fetchCouncilMembers = async () => {
    try {
      const response = await API.get('/council');
      setMembers(response.data);
    } catch (err) {
      console.error('Error fetching council members:', err);
      setError('Failed to load council members.');
    }
  };

  useEffect(() => {
    fetchCouncilMembers();
  }, []);

  if (error) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-20 p-8">
      <h1 className="text-3xl font-bold text-center text-goonsBlue">Council Members</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="p-4 bg-white rounded-lg shadow text-center">
            <img src={member.avatar} alt={member.name} className="w-24 h-24 mx-auto rounded-full object-cover" />
            <h2 className="mt-4 text-xl font-semibold text-goonsGreen">{member.name}</h2>
            <p className="mt-2 text-gray-600">{member.role}</p>
            {member.socialLinks && member.socialLinks.length > 0 && (
              <div className="mt-4 flex justify-center space-x-2">
                {member.socialLinks.map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-goonsBlue hover:underline">
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouncilPage;
