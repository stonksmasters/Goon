// src/pages/FeedPage.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const FeedPage = () => {
  const [memes, setMemes] = useState([]);
  const [error, setError] = useState(null);

  const fetchMemes = async () => {
    try {
      const response = await API.get('/memes');
      setMemes(response.data);
    } catch (err) {
      console.error('Error fetching memes:', err);
      setError('Failed to load memes.');
    }
  };

  useEffect(() => {
    fetchMemes();
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
      <h1 className="text-3xl font-bold text-center text-goonsBlue">Meme Feed</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <div key={meme._id} className="p-4 bg-white rounded-lg shadow">
            <img src={meme.memeData} alt="Meme" className="w-full h-64 object-cover rounded" />
            <div className="mt-4">
              <p className="text-gray-700">Created by: {meme.user.username}</p>
              <p className="text-gray-600 text-sm">Posted on: {new Date(meme.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
