// src/components/Profile/NFTCollection.jsx
import React from 'react';

const NFTCollection = ({ nfts }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">Your NFT Collection</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {nfts.map((nft) => (
          <div key={nft.id} className="border border-gray-300 p-2 rounded">
            <img src={nft.image} alt={nft.name} className="w-full h-32 object-cover rounded" />
            <p className="mt-2 text-center">{nft.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTCollection;
