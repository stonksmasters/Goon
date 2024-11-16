// src/pages/MemeGeneratorPage.js

import React, { useEffect, useRef } from 'react';
import StickerPanel from '../components/MemeGenerator/StickerPanel';
import MemeCanvas from '../components/MemeGenerator/MemeCanvas';
import { useWalletContext } from '../context/WalletContext';

const MemeGeneratorPage = () => {
  const { nfts, publicKey, loading, error } = useWalletContext();
  const memeCanvasRef = useRef(null);

  useEffect(() => {
    console.log('NFTs loaded:', nfts);
  }, [nfts]);

  const handleStickerClick = (imageURL, category) => {
    if (memeCanvasRef.current) {
      memeCanvasRef.current.addSticker(imageURL, category);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black-02 text-white">
        <p className="text-lg text-grey-06">Loading NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black-02 text-white">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black-02 text-white">
        <p className="text-lg text-grey-06">
          Please connect your wallet to use the Meme Generator.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-grow p-6 bg-black-02 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Meme Generator
        </h1>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Sticker Panel */}
          <div className="w-full lg:w-1/3 mb-8 lg:mb-0">
            <StickerPanel stickers={nfts} onStickerClick={handleStickerClick} />
          </div>

          {/* Meme Canvas */}
          <div className="w-full lg:w-2/3">
            <MemeCanvas ref={memeCanvasRef} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MemeGeneratorPage;
