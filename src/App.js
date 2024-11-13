// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import MemeGeneratorPage from './pages/MemeGeneratorPage';
import HomePage from './pages/HomePage';
import './App.css'; // Import any global styles here

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
                {/* Add other routes here as needed */}
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
