// src/pages/MemeGeneratorPage.js
import React, { useEffect } from 'react';
import StickerPanel from '../components/MemeGenerator/StickerPanel';
import MemeCanvas from '../components/MemeGenerator/MemeCanvas';
import { useWalletContext } from '../context/WalletContext';

const MemeGeneratorPage = () => {
  const { nfts, publicKey, loading, error } = useWalletContext();

  // Log nfts to verify data structure
  useEffect(() => {
    console.log('NFTs loaded:', nfts);
  }, [nfts]);

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
    <div
      className="mt-20 p-8 flex overflow-hidden"
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      <StickerPanel stickers={nfts} /> {/* Ensure valid NFTs are passed */}
      <MemeCanvas />
    </div>
  );
};

export default MemeGeneratorPage;
