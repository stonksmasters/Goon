import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create a centralized Axios instance for API calls
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  // Fetch home page data from the server
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/home');
      setData(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Failed to load home page data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refetch data when retry count changes
  useEffect(() => {
    fetchHomeData();
  }, [retry]);

  // Retry function to re-fetch data
  const handleRetry = () => setRetry((prev) => prev + 1);

  // Loading state
  if (loading) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-goonsGreen text-white font-semibold rounded-lg hover:bg-goonsGreen-dark transition duration-300"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  // Main content
  return (
    <div className="mt-20 p-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-goonsBlue">
          Welcome to the Goons Meme Generator
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Unleash your creativity by using your Solana NFTs as drag-and-drop stickers!
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
              Connect Your Wallet & Start Creating
            </h3>
            <p className="text-gray-700">
              Use our meme generator to create memes featuring your Solana NFTs. Just connect your wallet to access and use your NFTs as stickers in our drag-and-drop editor.
            </p>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <img
              src="/preview.png" // Replace with actual preview image
              alt="Meme Generator Preview"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      {renderDynamicSections(data)}

      {/* Call to Action Section */}
      <section className="mt-16 text-center">
        <h2 className="text-3xl font-semibold text-goonsBlue">Get Started with the Meme Generator!</h2>
        <p className="mt-4 text-lg text-gray-700">
          Connect your wallet, fetch your NFTs, and start creating memes today!
        </p>
        <a
          href="/meme-generator"
          className="mt-8 inline-block px-8 py-3 text-lg font-semibold text-white bg-goonsGreen rounded-lg shadow hover:bg-goonsGreen-dark transition duration-300"
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
      emptyMessage: 'No news available at the moment.',
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
      emptyMessage: 'No upcoming events at the moment.',
      renderItem: (event) => (
        <div key={event.title} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition duration-300">
          <h3 className="text-2xl font-bold text-goonsBlue">{event.title}</h3>
          <p className="mt-2 text-gray-700">{event.description}</p>
          <p className="mt-2 text-gray-600 font-semibold">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
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
      title: 'Community Statistics',
      items: data.statistics ? [data.statistics] : [],
      emptyMessage: 'No statistics available at the moment.',
      renderItem: (stats) => (
        <div key="stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Members" value={stats.totalMembers} />
          <StatCard title="Active Memes" value={stats.activeMemes} />
          <StatCard title="Events Held" value={stats.eventsHeld} />
        </div>
      ),
    },
  ];

  return sections.map((section, index) => (
    <section className="mt-12" key={index}>
      <h2 className="text-3xl font-semibold text-goonsGreen mb-4 text-center">{section.title}</h2>
      {section.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{section.items.map(section.renderItem)}</div>
      ) : (
        <p className="text-gray-500 text-center">{section.emptyMessage}</p>
      )}
    </section>
  ));
};

// Simple component for stats
const StatCard = ({ title, value }) => (
  <div className="p-6 bg-white rounded-lg shadow text-center">
    <p className="text-4xl font-bold text-goonsBlue">{value}</p>
    <p className="mt-2 text-gray-700 font-semibold">{title}</p>
  </div>
);

export default HomePage;
