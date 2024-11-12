// src/pages/FlashEventsPage.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const FlashEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await API.get('/flash-events');
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load flash events.');
    }
  };

  useEffect(() => {
    fetchEvents();
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
      <h1 className="text-3xl font-bold text-center text-goonsBlue">Flash Events</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event._id} className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-goonsGreen">{event.title}</h2>
            <p className="mt-2 text-gray-700">{event.description}</p>
            <p className="mt-2 text-gray-600"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            {event.link && (
              <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-goonsBlue hover:underline mt-2 inline-block">
                Event Details
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashEventsPage;
