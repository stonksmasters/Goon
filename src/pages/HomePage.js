// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import API from '../services/api';

/**
 * HomePage component for the Goons Community Meme Generator.
 * Explains features, NFT integration, and displays community stats, news, and events.
 */
const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      const response = await API.get('/home');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Failed to load home page data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

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
              Use our meme generator to create memes featuring your Solana NFTs. Just connect your wallet to access and use your NFTs as stickers in our drag-and-drop editor. Perfect for showcasing your collection in a fun and creative way!
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

      {/* Latest News Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-goonsGreen mb-4 text-center">
          Latest News
        </h2>
        {data.latestNews && data.latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.latestNews.map((news, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition duration-300">
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
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No news available at the moment.</p>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-goonsGreen mb-4 text-center">
          Upcoming Events
        </h2>
        {data.upcomingEvents && data.upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.upcomingEvents.map((event, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition duration-300">
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
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No upcoming events at the moment.</p>
        )}
      </section>

      {/* Community Statistics Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-goonsGreen mb-4 text-center">
          Community Statistics
        </h2>
        {data.statistics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <p className="text-4xl font-bold text-goonsBlue">{data.statistics.totalMembers}</p>
              <p className="mt-2 text-gray-700 font-semibold">Total Members</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <p className="text-4xl font-bold text-goonsBlue">{data.statistics.activeMemes}</p>
              <p className="mt-2 text-gray-700 font-semibold">Active Memes</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <p className="text-4xl font-bold text-goonsBlue">{data.statistics.eventsHeld}</p>
              <p className="mt-2 text-gray-700 font-semibold">Events Held</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No statistics available at the moment.</p>
        )}
      </section>

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

export default HomePage;
