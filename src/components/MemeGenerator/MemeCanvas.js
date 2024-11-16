// src/components/MemeGenerator/MemeCanvas.js

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Canvas, Image as FabricImage, Text } from 'fabric';
import { useWalletContext } from '../../context/WalletContext';
import {
  PlusIcon,
  TrashIcon,
  SaveIcon,
  PencilIcon,
  ColorSwatchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/solid';
import PrimaryButton from '../common/PrimaryButton';
import SecondaryButton from '../common/SecondaryButton';

// Use forwardRef to allow parent components to access methods in MemeCanvas
const MemeCanvas = forwardRef((props, ref) => {
  const canvasElementRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const { nfts } = useWalletContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  // Use useRef for mainLayerNumber to persist across renders
  const mainLayerNumberRef = useRef(2); // Starting layer number for main stickers

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
      const fabricCanvas = new Canvas(canvasElementRef.current, {
        height: 600,
        width: 600,
        backgroundColor: '#f3f3f3',
        selection: true,
      });
      fabricCanvasRef.current = fabricCanvas;

      // Set preserveObjectStacking to true
      fabricCanvas.preserveObjectStacking = true;

      // Function to apply zoom based on screen size
      const applyCanvasZoom = () => {
        const screenWidth = window.innerWidth;
        const zoomLevel = calculateZoom(screenWidth);

        fabricCanvas.setZoom(zoomLevel);
        fabricCanvas.setWidth(600 * zoomLevel);
        fabricCanvas.setHeight(600 * zoomLevel);

        fabricCanvas.renderAll();
      };

      // Set initial zoom level and resize on load
      applyCanvasZoom();
      window.addEventListener('resize', applyCanvasZoom);

      // Event Listeners to maintain layer order
      const handleObjectSelected = () => {
        sortCanvasByLayer();
      };

      fabricCanvas.on('object:selected', handleObjectSelected);
      fabricCanvas.on('selection:updated', handleObjectSelected);

      // Cleanup function
      return () => {
        fabricCanvas.off('object:selected', handleObjectSelected);
        fabricCanvas.off('selection:updated', handleObjectSelected);
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
        window.removeEventListener('resize', applyCanvasZoom);
      };
    }
  }, []); // Empty dependency array ensures this runs only once

  // Expose the addSticker function via ref
  useImperativeHandle(ref, () => ({
    addSticker: (imageURL, category) => {
      addSticker(imageURL, category);
    },
  }));

  /**
   * Sorts the canvas objects based on their layerNumber in ascending order.
   */
  const sortCanvasByLayer = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      const sortedObjects = fabricCanvas
        .getObjects()
        .sort((a, b) => a.layerNumber - b.layerNumber);
      fabricCanvas.clear();
      sortedObjects.forEach((obj) => fabricCanvas.add(obj));
      fabricCanvas.renderAll();
    }
  };

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
      const img = await FabricImage.fromURL(imageURL, {
        crossOrigin: 'anonymous',
      });

      if (img && fabricCanvasRef.current) {
        const fabricCanvas = fabricCanvasRef.current;
        const isPFP = category === 'Goons: 3D'; // Adjust based on category logic

        // Assign layerNumber and category
        if (isPFP) {
          img.set({
            layerNumber: 1,
            category: 'Goons: 3D',
            selectable: true, // Allow selection
            hasControls: true, // Show controls for resizing and rotation
          });
        } else {
          img.set({
            layerNumber: mainLayerNumberRef.current,
            category: 'Main',
            selectable: true,
          });
          mainLayerNumberRef.current += 1;
        }

        // Set position and scaling for the PFP or regular stickers
        img.set({
          left: fabricCanvas.width / 2,
          top: fabricCanvas.height / 2,
          originX: 'center',
          originY: 'center',
        });

        // Scale PFP sticker to fit the canvas if it's a PFP
        if (isPFP) {
          const scaleX = fabricCanvas.width / img.width;
          const scaleY = fabricCanvas.height / img.height;
          const scale = Math.max(scaleX, scaleY);
          img.scaleX = scale;
          img.scaleY = scale;
        } else {
          // Default scaling for regular images
          img.scaleToWidth(150);
        }

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);

        // Sort canvas based on layerNumber to ensure PFP stays at the bottom
        sortCanvasByLayer();
      } else {
        console.error(
          '[MemeCanvas] Image object creation failed for URL:',
          imageURL
        );
      }
    } catch (error) {
      console.error('[MemeCanvas] Error loading image from URL:', error);
    }
  };

  // Function to move selected object up in layers
  const handleLayerUp = () => {
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      // Prevent moving PFPs
      if (activeObject.layerNumber === 1) {
        return;
      }

      // Only allow moving Main category objects
      if (activeObject.category !== 'Main') {
        return;
      }

      // Find the object with layerNumber = activeObject.layerNumber -1
      const objAbove = fabricCanvas
        .getObjects()
        .find((obj) => obj.layerNumber === activeObject.layerNumber - 1);
      if (objAbove && objAbove.category === 'Main') {
        // Swap layerNumbers
        const tempLayer = activeObject.layerNumber;
        activeObject.layerNumber = objAbove.layerNumber;
        objAbove.layerNumber = tempLayer;

        // Sort canvas based on new layerNumbers
        sortCanvasByLayer();
      }
    }
  };

  // Function to move selected object down in layers
  const handleLayerDown = () => {
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      // Only allow moving Main category objects
      if (activeObject.category !== 'Main') {
        return;
      }

      // Find the maximum layerNumber to prevent moving beyond top
      const maxLayer = Math.max(
        ...fabricCanvas.getObjects().map((obj) => obj.layerNumber)
      );
      if (activeObject.layerNumber === maxLayer) {
        return;
      }

      // Find the object with layerNumber = activeObject.layerNumber +1
      const objBelow = fabricCanvas
        .getObjects()
        .find((obj) => obj.layerNumber === activeObject.layerNumber + 1);
      if (objBelow && objBelow.category === 'Main') {
        // Swap layerNumbers
        const tempLayer = activeObject.layerNumber;
        activeObject.layerNumber = objBelow.layerNumber;
        objBelow.layerNumber = tempLayer;

        // Sort canvas based on new layerNumbers
        sortCanvasByLayer();
      }
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
        layerNumber: mainLayerNumberRef.current,
        category: 'Main',
      });

      mainLayerNumberRef.current += 1;

      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.renderAll();
      setTextInput(''); // Clear the input field after adding text

      // Sort canvas based on layerNumber
      sortCanvasByLayer();
    }
  };

  // Function to delete the selected object from the canvas
  const handleDelete = () => {
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject); // Remove the selected object
      fabricCanvas.renderAll();
    }
  };

  // Function to save/export the canvas as an image
  const handleSave = () => {
    const fabricCanvas = fabricCanvasRef.current;

    if (fabricCanvas) {
      try {
        // Use toDataURL to get the image as a Data URL
        const dataURL = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
        });

        // Convert the Data URL to a Blob
        fetch(dataURL)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'meme.png';

            // Detect if the device is mobile
            const isMobile = /iPhone|iPad|iPod|Android/i.test(
              navigator.userAgent
            );

            if (isMobile) {
              // Open the image in a new tab for mobile devices
              window.open(url, '_blank');
            } else {
              // Trigger the download for desktop
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }

            // Revoke the Blob URL after a short delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          })
          .catch((error) => {
            console.error('[MemeCanvas] Error while saving canvas:', error);
            alert(
              'Failed to download the image. This might be due to CORS restrictions on certain images.'
            );
          });
      } catch (error) {
        console.error('[MemeCanvas] Error with toDataURL:', error);
        alert(
          'Unable to export canvas. This is likely due to CORS issues with one or more images.'
        );
      }
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

    const imageURL = e.dataTransfer.getData('text/plain');
    const category = e.dataTransfer.getData('application/category');

    if (!imageURL) {
      console.warn('[MemeCanvas] No image URL found in drop data.');
      return;
    }

    // Use the addSticker function
    addSticker(imageURL, category);
  };

  const handleDragOverEvent = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeaveEvent = () => {
    setIsDragOver(false);
  };

  useEffect(() => {
    const canvasContainer = canvasElementRef.current?.parentElement;
    if (!canvasContainer) {
      console.error('[MemeCanvas] canvasContainer is null.');
      return;
    }

    canvasContainer.addEventListener('drop', handleDropEvent);
    canvasContainer.addEventListener('dragover', handleDragOverEvent);
    canvasContainer.addEventListener('dragleave', handleDragLeaveEvent);

    return () => {
      canvasContainer.removeEventListener('drop', handleDropEvent);
      canvasContainer.removeEventListener('dragover', handleDragOverEvent);
      canvasContainer.removeEventListener('dragleave', handleDragLeaveEvent);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black-04 rounded-xl shadow-3xl text-white font-sans">
      {/* Controls Section */}
      <div className="mb-6 w-full flex flex-col space-y-4">
        {/* Text Input and Formatting Options */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          {/* Text Input */}
          <div className="flex flex-col flex-1">
            <label htmlFor="textInput" className="text-lg font-semibold">
              Add Text
            </label>
            <input
              id="textInput"
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text"
              className="px-4 py-3 border border-grey-04 rounded-md bg-grey-01 text-white placeholder-grey-05 focus:outline-none focus:ring-2 focus:ring-neon-green transition"
              aria-label="Enter text to add to canvas"
            />
          </div>

          {/* Font Selection */}
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <PencilIcon className="h-5 w-5 text-grey-07" />
            <label htmlFor="fontSelect">Font:</label>
            <select
              id="fontSelect"
              value={selectedFont}
              onChange={handleFontChange}
              className="mt-1 block w-full py-2 px-3 border border-grey-04 bg-grey-02 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neon-green text-white"
              aria-label="Select font for text"
            >
              <option value="Inter">Inter</option>
              <option value="Oswald">Oswald</option>
              <option value="Arial">Arial</option>
              {/* Add more fonts as needed */}
            </select>
          </div>

          {/* Color Picker */}
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <ColorSwatchIcon className="h-5 w-5 text-grey-07" />
            <label htmlFor="colorPicker">Text Color:</label>
            <input
              id="colorPicker"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="w-10 h-10 p-0 border-0 rounded-md focus:ring-2 focus:ring-neon-green"
              aria-label="Select color for text"
            />
          </div>
        </div>

        {/* Add Text Button */}
        <div className="mt-4">
          <PrimaryButton onClick={handleAddText} aria-label="Add text to canvas">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Text
          </PrimaryButton>
        </div>
      </div>

      {/* Canvas Section */}
      <div className="flex flex-col items-center">
        {/* Canvas Container */}
        <div
          className={`relative border-4 rounded-lg p-2 bg-grey-01 transition-all duration-200 ${
            isDragOver ? 'border-neon-green bg-black-03' : 'border-transparent'
          }`}
          aria-label="Meme Canvas Drop Area"
        >
          {/* Responsive Scaling Container */}
          <div className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] overflow-hidden">
            <canvas
              ref={canvasElementRef}
              className="w-full h-full border-2 border-dashed border-neon-green rounded-lg"
              width={600}
              height={600}
            />
            {isDragOver && (
              <div className="absolute inset-0 bg-neon-green bg-opacity-20 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-neon-green font-semibold">
                  Drop here to add image
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-grey-06 text-center">
          Drag and drop images here or use the controls above.
        </p>
      </div>

      {/* Action Buttons Underneath Canvas */}
      <div className="mt-6 w-full flex flex-wrap justify-center space-x-4">
        <SecondaryButton
          onClick={handleDelete}
          aria-label="Delete selected object"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Delete Selected
        </SecondaryButton>
        <SecondaryButton
          onClick={handleLayerUp}
          aria-label="Move selected object up a layer"
        >
          <ArrowUpIcon className="h-5 w-5 mr-2" />
          Move Up Layer
        </SecondaryButton>
        <SecondaryButton
          onClick={handleLayerDown}
          aria-label="Move selected object down a layer"
        >
          <ArrowDownIcon className="h-5 w-5 mr-2" />
          Move Down Layer
        </SecondaryButton>
        <SecondaryButton onClick={handleSave} aria-label="Save canvas as image">
          <SaveIcon className="h-5 w-5 mr-2" />
          Save
        </SecondaryButton>
      </div>
    </div>
  );
});

export default React.memo(MemeCanvas);
