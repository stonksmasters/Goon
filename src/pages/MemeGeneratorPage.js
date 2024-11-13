// src/pages/MemeGeneratorPage.js
import React, { useEffect, useRef } from 'react';
import StickerPanel from '../components/MemeGenerator/StickerPanel';
import MemeCanvas from '../components/MemeGenerator/MemeCanvas';
import { useWalletContext } from '../context/WalletContext';

const MemeGeneratorPage = () => {
  const { nfts, publicKey, loading, error } = useWalletContext();
  const memeCanvasRef = useRef(null); // Ref to access MemeCanvas methods

  // Log nfts to verify data structure
  useEffect(() => {
    console.log('NFTs loaded:', nfts);
  }, [nfts]);

  // Function to handle sticker click and add it to the canvas
  const handleStickerClick = (imageURL, category) => {
    if (memeCanvasRef.current) {
      memeCanvasRef.current.addSticker(imageURL, category); // Call addSticker function from MemeCanvas
    }
  };

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-gray-700">Loading NFTs...</p>
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

  if (!publicKey) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-gray-700">
          Please connect your wallet to use the Meme Generator.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-goonsBlue mb-8">Meme Generator</h1>
        
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* Sticker Panel */}
          <StickerPanel stickers={nfts} onStickerClick={handleStickerClick} /> {/* Pass handleStickerClick */}

          {/* Meme Canvas */}
          <MemeCanvas ref={memeCanvasRef} />
        </div>
      </div>
    </main>
  );
};

export default MemeGeneratorPage;
