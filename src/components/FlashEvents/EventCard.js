// src/components/FlashEvents/EventCard.jsx
import React from 'react';
import axios from 'axios';

const EventCard = ({ event }) => {
  const handleVote = async (voteType) => {
    try {
      await axios.post(`/api/events/${event.id}/vote`, { voteType });
      // Optionally, refresh event data or update state
    } catch (error) {
      console.error('Error voting on event:', error);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p className="mt-2">{event.description}</p>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => handleVote('yes')}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Yes
        </button>
        <button
          onClick={() => handleVote('no')}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          No
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Votes: Yes ({event.votesYes}) | No ({event.votesNo})
      </div>
    </div>
  );
};

export default EventCard;
