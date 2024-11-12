// src/components/MemeGenerator/StickerPanel.js
import React from 'react';
import { useWalletContext } from '../../context/WalletContext';

const StickerPanel = ({ onSelectSticker }) => {
  const { nfts } = useWalletContext();

  return (
    <div className="mt-4">
      {nfts.length === 0 ? (
        <p className="text-gray-500">No NFTs available to use as stickers.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {nfts.map((nft, index) => (
            <img
              key={index}
              src={nft.image}
              alt={nft.name}
              className="w-16 h-16 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-200"
              onClick={() => onSelectSticker(nft)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StickerPanel;
