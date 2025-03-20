import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Centralized Axios instance with timeout
const api = axios.create({
  baseURL: '/apiProxy', // Consistent for dev and prod
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10-second timeout to handle Render cold starts
});

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoized fetch function
  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/home');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching home data:', err);
      let errorMessage = 'Failed to load home page data.';
      if (err.response) {
        console.error('Response error:', err.response);
        errorMessage = `Status: ${err.response.status}, Message: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. It might be waking up—try again!';
      } else if (err.code === 'ECONNABORTED') {
        console.error('Request timed out:', err.message);
        errorMessage = 'Request timed out. Please try again.';
      } else {
        console.error('Error setting up request:', err.message);
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount and retry
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData, retryCount]);

  // Retry handler
  const handleRetry = () => setRetryCount((prev) => prev + 1);

  // Loading state with spinner
  if (loading) {
    return (
      <div className="mt-20 flex justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-goonsGreen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p className="ml-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-red-500">{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-goonsGreen text-white font-semibold rounded-lg hover:bg-goonsGreen-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-goonsGreen focus:ring-opacity-50"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  // Main content
  return (
    <div className="mt-20 p-8 max-w-7xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-goonsBlue">
          Welcome to the Goons Meme Generator
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Unleash your creativity with Solana NFTs as drag-and-drop stickers!
        </p>
      </header>

      {/* Meme Generator Feature Section */}
      <section className="mt-12 bg-goonsGreen bg-opacity-10 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-goonsGreen text-center mb-6">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-goonsBlue mb-4">
              Connect Your Wallet & Create
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Craft hilarious memes using your Solana NFTs. Connect your wallet, grab your stickers, and drag them into our editor to get started.
            </p>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <img
              src="/preview.png" // Ensure this exists in public/
              alt="Meme Generator Preview"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              onError={(e) => (e.target.src = '/fallback-image.png')} // Fallback if preview.png is missing
            />
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      {renderDynamicSections(data)}

      {/* Call to Action Section */}
      <section className="mt-16 text-center">
        <h2 className="text-3xl font-semibold text-goonsBlue">Start Meme-ing Now!</h2>
        <p className="mt-4 text-lg text-gray-700">
          Connect your wallet, fetch your NFTs, and unleash your inner meme lord today!
        </p>
        <a
          href="/meme-generator"
          className="mt-8 inline-block px-8 py-3 text-lg font-semibold text-white bg-goonsGreen rounded-lg shadow-lg hover:bg-goonsGreen-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-goonsGreen focus:ring-opacity-50"
        >
          Launch Meme Generator
        </a>
      </section>
    </div>
  );
};

// Helper function to render dynamic sections
const renderDynamicSections = (data) => {
  if (!data) return null;

  const sections = [
    {
      title: 'Latest News',
      items: data.latestNews || [],
      emptyMessage: 'No news available right now—check back soon!',
      renderItem: (news) => (
        <div key={news.title} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition duration-300">
          <h3 className="text-2xl font-bold text-goonsBlue">{news.title}</h3>
          <p className="mt-2 text-gray-700">{news.description}</p>
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-goonsGreen hover:underline mt-4 inline-block font-semibold"
          >
            Read More →
          </a>
        </div>
      ),
    },
    {
      title: 'Upcoming Events',
      items: data.upcomingEvents || [],
      emptyMessage: 'No events scheduled—stay tuned!',
      renderItem: (event) => (
        <div key={event.title} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition duration-300">
          <h3 className="text-2xl font-bold text-goonsBlue">{event.title}</h3>
          <p className="mt-2 text-gray-700">{event.description}</p>
          <p className="mt-2 text-gray-600 font-semibold">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-goonsGreen hover:underline mt-4 inline-block font-semibold"
          >
            Event Details →
          </a>
        </div>
      ),
    },
    {
      title: 'Community Stats',
      items: data.statistics ? [data.statistics] : [],
      emptyMessage: 'Stats coming soon!',
      renderItem: (stats) => (
        <div key="stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Members" value={stats.totalMembers ?? 'N/A'} />
          <StatCard title="Active Memes" value={stats.activeMemes ?? 'N/A'} />
          <StatCard title="Events Held" value={stats.eventsHeld ?? 'N/A'} />
        </div>
      ),
    },
  ];

  return sections.map((section, index) => (
    <section className="mt-12" key={index}>
      <h2 className="text-3xl font-semibold text-goonsGreen mb-6 text-center">{section.title}</h2>
      {section.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{section.items.map(section.renderItem)}</div>
      ) : (
        <p className="text-gray-500 text-center italic">{section.emptyMessage}</p>
      )}
    </section>
  ));
};

// StatCard component with fallback
const StatCard = ({ title, value }) => (
  <div className="p-6 bg-white rounded-lg shadow text-center transform hover:scale-105 transition duration-300">
    <p className="text-4xl font-bold text-goonsBlue">{value}</p>
    <p className="mt-2 text-gray-700 font-semibold">{title}</p>
  </div>
);

export default HomePage;