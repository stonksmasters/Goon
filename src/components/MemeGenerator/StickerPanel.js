// src/components/MemeGenerator/StickerPanel.js

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from '@heroicons/react/outline';

/**
 * StickerPanel Component
 *
 * Displays a list of stickers that can be dragged onto the MemeCanvas or clicked to add directly.
 *
 * @param {Array} stickers - The list of sticker objects to display.
 * @param {Function} onStickerClick - Function to handle adding stickers on click.
 */
const StickerPanel = ({ stickers, onStickerClick }) => { 
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredStickers, setFilteredStickers] = useState(stickers);

  // Array of hardcoded stickers
  const hardcodedStickers = [
    {
      id: 'hardcoded-sticker-1',
      name: 'Mug',
      image: '/Mug.PNG', // Replace with actual image path
      category: 'Stickers',
    },
    {
      id: 'hardcoded-sticker-2',
      name: 'GM',
      image: '/GM.PNG', // Replace with actual image path
      category: 'Stickers',
    },
    {
      id: 'hardcoded-sticker-3',
      name: 'GN',
      image: 'GN.PNG', // Replace with actual image path
      category: 'Stickers',
    },
    // Add more stickers as needed
  ];

  useEffect(() => {
    // Concatenate fetched stickers with hardcoded stickers
    let allStickers = [...stickers, ...hardcodedStickers];

    // Filter by selected category
    if (activeCategory !== 'All') {
      allStickers = allStickers.filter((sticker) => {
        const category = sticker.category || sticker.name.split(" #")[0];
        switch (activeCategory) {
          case 'PFP':
            return category === 'Goons: 3D';
          case 'Evopills':
            return category === 'Evopill';
          case 'Goons Teddy':
            return category === 'Goons: Teddy Edition';
          case 'Stickers':
            return category === 'Stickers';
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      allStickers = allStickers.filter((sticker) =>
        sticker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort stickers by the number after '#' in the name
    allStickers.sort((a, b) => {
      const numA = parseInt(a.name.split("#")[1], 10);
      const numB = parseInt(b.name.split("#")[1], 10);
      return numA - numB;
    });

    setFilteredStickers(allStickers);
  }, [stickers, searchTerm, activeCategory]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  /**
   * Handles the drag start event for a sticker.
   * Passes both the image URL and the category of the sticker.
   *
   * @param {React.DragEvent} e - The drag event.
   * @param {string} imageURL - The URL of the sticker image.
   * @param {string} category - The category of the sticker.
   */
  const handleDragStart = (e, imageURL, category) => {
    e.dataTransfer.setData('text/plain', imageURL);
    e.dataTransfer.setData('application/category', category);
    e.dataTransfer.effectAllowed = 'copy';
  };

  /**
   * Handles the click event for a sticker.
   * Calls the onStickerClick prop with imageURL and category.
   *
   * @param {string} imageURL - The URL of the sticker image.
   * @param {string} category - The category of the sticker.
   */
  const handleStickerClick = (imageURL, category) => {
    if (onStickerClick) {
      onStickerClick(imageURL, category);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-black-05 shadow-2xl rounded-xl mx-auto mb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">Available Stickers</h2>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <input
              type="text"
              placeholder="Search stickers..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-grey-04 rounded-md shadow-sm bg-grey-01 text-white placeholder-grey-05 focus:outline-none focus:ring-2 focus:ring-orange transition"
              aria-label="Search stickers"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-07 h-5 w-5" />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-orange p-2 rounded-md hover:bg-grey-03 focus:outline-none focus:ring-2 focus:ring-orange transition"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse sticker panel' : 'Expand sticker panel'}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-6 w-6" />
            ) : (
              <ChevronDownIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center space-x-3 mb-6 overflow-x-auto">
        {['All', 'PFP', 'Evopills', 'Goons Teddy', 'Stickers'].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-orange text-black-01'
                : 'bg-grey-04 text-grey-07 hover:bg-grey-03'
            } focus:outline-none focus:ring-2 focus:ring-orange`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sticker List */}
      {isOpen && (
        <div className="max-h-96 overflow-y-auto">
          {filteredStickers.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredStickers.map((sticker) => {
                const category = sticker.category || sticker.name.split(" #")[0];
                return (
                  <div
                    key={sticker.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sticker.image, category)}
                    onClick={() => handleStickerClick(sticker.image, category)}
                    className="relative group bg-grey-01 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <img
                      src={sticker.image}
                      alt={sticker.name}
                      className="w-full h-24 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error(`[StickerPanel] Failed to load image for sticker ID: ${sticker.id}`);
                        e.target.src = '/placeholder.png';
                      }}
                    />
                    <p className="absolute bottom-0 left-0 right-0 bg-black-03 text-xs text-white text-center py-1">
                      {sticker.name}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-grey-06 text-center">No stickers available.</p>
          )}
        </div>
      )}
    </div>
  );

};

export default StickerPanel;
