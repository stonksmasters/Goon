// src/components/FlashEvents/FlashEventsDashboard.jsx
import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import EventSubmission from './EventSubmission';
import axios from 'axios';

const FlashEventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    // Fetch flash events from backend
    axios.get('/api/events').then((response) => {
      setEvents(response.data);
      // Optionally, set activeEvent based on current time
    });
  }, []);

  const handleNewEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Flash Events</h1>
      <EventSubmission onNewEvent={handleNewEvent} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default FlashEventsDashboard;
