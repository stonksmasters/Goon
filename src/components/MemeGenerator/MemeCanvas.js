// src/components/MemeGenerator/MemeCanvas.js

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, Image, Text } from 'fabric';
import { useWalletContext } from '../../context/WalletContext';
import {
  PlusIcon,
  TrashIcon,
  SaveIcon,
  PencilIcon,
  ColorSwatchIcon,
} from '@heroicons/react/outline';

// Use forwardRef to allow parent components to access methods in MemeCanvas
const MemeCanvas = forwardRef((props, ref) => {
  const canvasElementRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const { nfts } = useWalletContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedColor, setSelectedColor] = useState('#000000');

  console.log('[MemeCanvas] Component initialized');

  // Function to calculate zoom level based on screen width
  const calculateZoom = (screenWidth) => {
    if (screenWidth < 768) {
      return 0.5; // Mobile
    } else if (screenWidth < 1024) {
      return 0.75; // Tablet
    } else {
      return 1; // Desktop
    }
  };

  // Initialize Fabric.js Canvas as a square once
  useEffect(() => {
    if (!fabricCanvasRef.current && canvasElementRef.current) {
      console.log('[MemeCanvas] Initializing Fabric.js Canvas');
      const fabricCanvas = new Canvas(canvasElementRef.current, {
        height: 600,
        width: 600,
        backgroundColor: '#f3f3f3',
        selection: true,
      });
      fabricCanvasRef.current = fabricCanvas;

      // Function to apply zoom based on screen size
      const applyCanvasZoom = () => {
        const screenWidth = window.innerWidth;
        const zoomLevel = calculateZoom(screenWidth);

        fabricCanvas.setZoom(zoomLevel);
        fabricCanvas.setWidth(600 * zoomLevel);
        fabricCanvas.setHeight(600 * zoomLevel);

        fabricCanvas.renderAll();
        console.log(`[MemeCanvas] Applied zoom level: ${zoomLevel}`);
      };

      // Set initial zoom level and resize on load
      applyCanvasZoom();
      window.addEventListener('resize', applyCanvasZoom);

      // Cleanup function to dispose of canvas on unmount
      return () => {
        console.log('[MemeCanvas] Disposing Fabric.js Canvas');
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
        window.removeEventListener('resize', applyCanvasZoom);
      };
    } else {
      console.warn('[MemeCanvas] Canvas initialization skipped');
    }
  }, []);

  // Expose the addSticker function via ref
  useImperativeHandle(ref, () => ({
    addSticker: (imageURL, category) => {
      addSticker(imageURL, category);
    },
  }));

  /**
   * Adds a sticker to the canvas based on its imageURL and category.
   *
   * @param {string} imageURL - The URL of the sticker image.
   * @param {string} category - The category of the sticker.
   */
  const addSticker = async (imageURL, category) => {
    if (!imageURL) {
      console.warn('[MemeCanvas] No image URL provided for adding sticker');
      return;
    }

    try {
      console.log('[MemeCanvas] Attempting to load image from URL...');
      const img = await Image.fromURL(imageURL, { crossOrigin: 'anonymous' });

      if (img && fabricCanvasRef.current) {
        console.log('[MemeCanvas] Image object successfully created from URL:', imageURL);

        const fabricCanvas = fabricCanvasRef.current;

        const isPFP = category === 'Goons: 3D'; // Adjust based on category logic

        if (isPFP) {
          // Calculate scaling factors to cover the canvas
          const scaleX = fabricCanvas.width / img.width;
          const scaleY = fabricCanvas.height / img.height;
          const scale = Math.max(scaleX, scaleY); // Ensure the image covers the canvas

          img.set({
            left: fabricCanvas.width / 2,
            top: fabricCanvas.height / 2,
            originX: 'center',
            originY: 'center',
            selectable: false, // Make it a background image
          });

          img.scaleX = scale;
          img.scaleY = scale;

          // Optionally, send the PFP image to the back
          fabricCanvas.add(img);
          fabricCanvas.sendToBack(img);
        } else {
          // Default scaling for regular images
          img.set({
            left: fabricCanvas.width / 2,
            top: fabricCanvas.height / 2,
            originX: 'center',
            originY: 'center',
            selectable: true,
          });
          img.scaleToWidth(150);
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
        }

        fabricCanvas.renderAll();
        console.log('[MemeCanvas] Image added and rendered on canvas:', imageURL);
      } else {
        console.error('[MemeCanvas] Image object creation failed');
      }
    } catch (error) {
      console.error('[MemeCanvas] Error loading image from URL:', error);
    }
  };

  const handleAddText = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas && textInput.trim()) {
      const text = new Text(textInput, {
        left: fabricCanvas.width / 2,
        top: fabricCanvas.height / 2,
        originX: 'center',
        originY: 'center',
        fontSize: 24,
        fill: selectedColor,
        fontFamily: selectedFont,
        selectable: true,
      });

      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.renderAll();
      console.log('[MemeCanvas] Text added to canvas:', textInput);
      setTextInput(''); // Clear the input field after adding text
    }
  };

  // Function to delete the selected object from the canvas
  const handleDelete = () => {
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject); // Remove the selected object
      fabricCanvas.renderAll();
      console.log('[MemeCanvas] Active object deleted from canvas');
    } else {
      console.log('[MemeCanvas] No active object selected');
    }
  };

  // Function to save/export the canvas as an image
  const handleSave = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'meme.png';
      link.click();
      console.log('[MemeCanvas] Canvas saved as meme.png');
    }
  };

  // Function to handle font selection change
  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set('fontFamily', e.target.value);
      fabricCanvas.renderAll();
    }
  };

  // Function to handle color selection change
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set('fill', e.target.value);
      fabricCanvas.renderAll();
    }
  };

  /**
   * Handles the drop event on the canvas.
   * Retrieves both the imageURL and category from the drag event.
   * Scales the image appropriately based on its category.
   *
   * @param {React.DragEvent} e - The drag event.
   */
  const handleDropEvent = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log('[MemeCanvas] Handling drop event');

    const imageURL = e.dataTransfer.getData('text/plain');
    const category = e.dataTransfer.getData('application/category');
    console.log('[MemeCanvas] Received image URL from drop:', imageURL);
    console.log('[MemeCanvas] Received category from drop:', category);

    if (!imageURL) {
      console.warn('[MemeCanvas] No image URL found in drop data');
      return;
    }

    // Use the addSticker function
    addSticker(imageURL, category);
  };

  const handleDragOverEvent = (e) => {
    e.preventDefault();
    setIsDragOver(true);
    console.log('[MemeCanvas] Drag over canvas detected');
  };

  const handleDragLeaveEvent = () => {
    setIsDragOver(false);
    console.log('[MemeCanvas] Drag leave canvas detected');
  };

  useEffect(() => {
    const canvasContainer = canvasElementRef.current?.parentElement;
    if (!canvasContainer) {
      console.error('[MemeCanvas] canvasContainer is null');
      return;
    }

    console.log('[MemeCanvas] Attempting to attach event listeners to canvas container');
    canvasContainer.addEventListener('drop', handleDropEvent);
    console.log('[MemeCanvas] Drop event listener attached');
    canvasContainer.addEventListener('dragover', handleDragOverEvent);
    console.log('[MemeCanvas] Dragover event listener attached');
    canvasContainer.addEventListener('dragleave', handleDragLeaveEvent);
    console.log('[MemeCanvas] Dragleave event listener attached');

    return () => {
      canvasContainer.removeEventListener('drop', handleDropEvent);
      canvasContainer.removeEventListener('dragover', handleDragOverEvent);
      canvasContainer.removeEventListener('dragleave', handleDragLeaveEvent);
      console.log('[MemeCanvas] Event listeners for drag-and-drop removed');
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      {/* Controls Section */}
      <div className="flex flex-col w-full md:w-1/3 space-y-6">
        {/* Text Input */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="textInput" className="text-lg font-medium text-gray-700">
            Add Text
          </label>
          <input
            id="textInput"
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text to add to canvas"
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Enter text to add to canvas"
          />
        </div>

        {/* Font and Color Selection */}
        <div className="flex flex-col space-y-4">
          {/* Font Selection */}
          <div className="flex items-center space-x-3">
            <PencilIcon className="h-5 w-5 text-gray-700" />
            <label htmlFor="fontSelect" className="text-gray-700">
              Font:
            </label>
            <select
              id="fontSelect"
              value={selectedFont}
              onChange={handleFontChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select font for text"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              {/* Add more fonts as needed */}
            </select>
          </div>

          {/* Color Picker */}
          <div className="flex items-center space-x-3">
            <ColorSwatchIcon className="h-5 w-5 text-gray-700" />
            <label htmlFor="colorPicker" className="text-gray-700">
              Text Color:
            </label>
            <input
              id="colorPicker"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="mt-1 block w-10 h-10 p-0 border-0 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="Select color for text"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleAddText}
            className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Add text to canvas"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Text
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete selected object"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete Selected
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Save canvas as image"
          >
            <SaveIcon className="h-5 w-5 mr-2" />
            Save
          </button>
        </div>
      </div>

      {/* Canvas Section */}
      <div className="flex-1 flex flex-col items-center">
        {/* Canvas Container */}
        <div
          className={`relative border-4 rounded-lg p-2 bg-gray-50 transition-all duration-200 ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-transparent'
          }`}
          aria-label="Meme Canvas Drop Area"
        >
          {/* Responsive Scaling Container */}
          <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[600px] lg:h-[600px] overflow-hidden">
            <canvas
              ref={canvasElementRef}
              className="w-full h-full border-2 border-dashed border-blue-500 rounded-lg"
              width={600}
              height={600}
            />
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-100 opacity-50 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-blue-700 font-semibold">Drop here to add image</span>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Drag and drop images here or use the buttons to add text.
        </p>
      </div>
    </div>
  );
});

export default MemeCanvas;
