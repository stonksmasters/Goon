// src/components/MemeGenerator/StickerPanel.js

import React from 'react';

const StickerPanel = ({ stickers }) => {
  console.log('[StickerPanel] Stickers received:', stickers);

  const handleDragStart = (e, imageURL) => {
    console.log(`[StickerPanel] Starting drag for image URL: ${imageURL}`);
    e.dataTransfer.setData('text/plain', imageURL); // Sets the image URL for transfer
    e.dataTransfer.effectAllowed = 'copy';

    // Debug: Verify the drag data is correctly set
    const testData = e.dataTransfer.getData('text/plain');
    if (testData === imageURL) {
      console.log('[StickerPanel] Drag data set successfully:', testData);
    } else {
      console.warn('[StickerPanel] Drag data mismatch:', testData);
    }
  };

  return (
    <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4">Available Stickers</h2>
      <div className="grid grid-cols-2 gap-4">
        {stickers && stickers.length > 0 ? (
          stickers.map((sticker) => (
            <div
              key={sticker.id}
              draggable
              onDragStart={(e) => handleDragStart(e, sticker.image)}
              className="border rounded p-1 cursor-grab"
            >
              <img
                src={sticker.image}
                alt={sticker.name}
                className="w-full h-auto"
                onError={(e) => {
                  console.error(`[StickerPanel] Failed to load image for sticker ID: ${sticker.id}`);
                  e.target.src = '/placeholder.png';
                }}
              />
              <p className="text-sm text-center mt-2">{sticker.name}</p>
            </div>
          ))
        ) : (
          <p>No stickers available.</p>
        )}
      </div>
    </div>
  );
};

export default StickerPanel;
