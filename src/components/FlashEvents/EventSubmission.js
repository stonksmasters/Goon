// src/components/FlashEvents/EventSubmission.jsx
import React, { useState } from 'react';
import axios from 'axios';

const EventSubmission = ({ onNewEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const event = { title, description };
    try {
      const response = await axios.post('/api/events', event);
      onNewEvent(response.data);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border border-gray-300 rounded">
      <div className="mb-2">
        <label className="block text-gray-700">Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Event Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border border-gray-300 p-2 rounded"
        ></textarea>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Create Event
      </button>
    </form>
  );
};

export default EventSubmission;
