// src/components/MemeGenerator/StickerPanel.js

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from '@heroicons/react/solid';

/**
 * StickerPanel Component
 *
 * Displays a list of stickers (NFTs) that can be dragged onto the MemeCanvas or clicked to add directly.
 *
 * @param {Array} stickers - The list of sticker objects to display.
 * @param {Function} onStickerClick - Function to handle adding stickers on click.
 */
const StickerPanel = ({ stickers, onStickerClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredStickers, setFilteredStickers] = useState([]);
  const [visibleStickers, setVisibleStickers] = useState([]);
  const [loadMoreCount] = useState(20); // Number of stickers to load per batch
  const [hasMore, setHasMore] = useState(true);
  const stickersContainerRef = useRef(null);

  // Array of categories
  const categories = ['All', 'PFP', 'Evopills', 'Goons Teddy', 'Stickers'];

  // Array of hardcoded stickers
  const hardcodedStickers = [
    {
      id: 'hardcoded-sticker-1',
      name: 'Mug',
      image: '/Mug.PNG',
      category: 'Stickers',
    },
    {
      id: 'hardcoded-sticker-2',
      name: 'GM',
      image: '/GM.PNG',
      category: 'Stickers',
    },
    {
      id: 'hardcoded-sticker-3',
      name: 'GN',
      image: '/GN.PNG',
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
        const category = sticker.category || sticker.name.split(' #')[0];
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
      const numA = parseInt(a.name.split('#')[1], 10);
      const numB = parseInt(b.name.split('#')[1], 10);
      return numA - numB;
    });

    setFilteredStickers(allStickers);
    setVisibleStickers(allStickers.slice(0, loadMoreCount));
    setHasMore(allStickers.length > loadMoreCount);
  }, [stickers, searchTerm, activeCategory, loadMoreCount]);

  // Load more stickers when scrolled to the bottom
  const handleScroll = () => {
    if (
      stickersContainerRef.current &&
      stickersContainerRef.current.scrollTop + stickersContainerRef.current.clientHeight >=
        stickersContainerRef.current.scrollHeight - 10
    ) {
      loadMoreStickers();
    }
  };

  const loadMoreStickers = () => {
    const newCount = visibleStickers.length + loadMoreCount;
    const newVisibleStickers = filteredStickers.slice(0, newCount);
    setVisibleStickers(newVisibleStickers);
    setHasMore(filteredStickers.length > newCount);
  };

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

  // Handle category change from dropdown
  const handleCategoryChange = (e) => {
    setActiveCategory(e.target.value);
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-black-04 shadow-3xl rounded-xl mx-auto mb-6 text-white font-sans">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Available Stickers</h2>
        <div className="flex flex-col items-center space-y-4">
          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search stickers..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-grey-04 rounded-md bg-grey-01 text-white placeholder-grey-05 focus:outline-none focus:ring-2 focus:ring-neon-green transition"
              aria-label="Search stickers"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-07 h-5 w-5" />
          </div>
          {/* Category Dropdown */}
          <div className="relative w-full max-w-sm">
            <select
              value={activeCategory}
              onChange={handleCategoryChange}
              className="w-full pl-4 pr-10 py-2 border border-grey-04 rounded-md bg-grey-01 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-neon-green transition"
              aria-label="Select category"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="text-black-01">
                  {category}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-grey-07 h-5 w-5 pointer-events-none" />
          </div>
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-neon-green p-2 rounded-md hover:bg-grey-03 focus:outline-none focus:ring-2 focus:ring-neon-green transition"
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

      {/* Sticker List */}
      {isOpen && (
        <div
          className="max-h-96 overflow-y-auto"
          ref={stickersContainerRef}
          onScroll={handleScroll}
        >
          {visibleStickers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {visibleStickers.map((sticker) => {
                const category = sticker.category || sticker.name.split(' #')[0];
                return (
                  <div
                    key={sticker.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sticker.image, category)}
                    onClick={() => handleStickerClick(sticker.image, category)}
                    className="relative group bg-grey-01 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="w-full aspect-w-1 aspect-h-1">
                      <img
                        src={sticker.image}
                        alt={sticker.name}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error(
                            `[StickerPanel] Failed to load image for sticker ID: ${sticker.id}`
                          );
                          e.target.src = '/placeholder.png';
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black-03 bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center">
                      <p className="text-white text-sm opacity-0 group-hover:opacity-100">
                        {sticker.name}
                      </p>
                    </div>
                  </div>
                );
              })}
              {hasMore && (
                <div className="col-span-full flex justify-center mt-4">
                  <button
                    onClick={loadMoreStickers}
                    className="px-4 py-2 bg-grey-03 text-white rounded-md hover:bg-grey-02 transition duration-300 focus:outline-none focus:ring-2 focus:ring-grey-04"
                  >
                    Load More
                  </button>
                </div>
              )}
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
