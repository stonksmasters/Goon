// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MemeGeneratorPage from './pages/MemeGeneratorPage';
import HomePage from './pages/HomePage';
import CouncilPage from './pages/CouncilPage';
import FlashEventsPage from './pages/FlashEventsPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css'; // Include if you have global styles

function App() {
  return (
    <WalletModalProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-gray-100">
            <div className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/meme-generator" element={<MemeGeneratorPage />} />
                <Route path="/council" element={<CouncilPage />} />
                <Route path="/flash-events" element={<FlashEventsPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </WalletModalProvider>
  );
}

export default App;
