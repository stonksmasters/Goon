// src/pages/MemeGeneratorPage.js
import React from 'react';
import StickerPanel from '../components/MemeGenerator/StickerPanel';
import MemeCanvas from '../components/MemeGenerator/MemeCanvas';
import { useWallet } from '@solana/wallet-adapter-react';
import API from '../services/api';

const MemeGeneratorPage = () => {
  const { publicKey } = useWallet();
  const [stickers, setStickers] = React.useState([]);
  const [error, setError] = React.useState(null);

  const fetchStickers = async () => {
    if (!publicKey) return;

    try {
      const response = await API.get(`/stickers?walletAddress=${publicKey.toBase58()}`);
      setStickers(response.data);
    } catch (err) {
      console.error('Error fetching stickers:', err);
      setError('Failed to load stickers.');
    }
  };

  React.useEffect(() => {
    fetchStickers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="mt-20 text-center">
        <p className="text-lg text-gray-700">Please connect your wallet to use the Meme Generator.</p>
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
    <div className="mt-20 p-8 flex">
      <StickerPanel stickers={stickers} />
      <MemeCanvas />
    </div>
  );
};

export default MemeGeneratorPage;
