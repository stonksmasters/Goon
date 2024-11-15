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
  ArrowUpIcon,
  ArrowDownIcon,
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
  
  // Use useRef for mainLayerNumber to persist across renders
  const mainLayerNumberRef = useRef(2); // Starting layer number for main stickers

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

      // **Set preserveObjectStacking to true**
      fabricCanvas.preserveObjectStacking = true;
      console.log('[MemeCanvas] preserveObjectStacking set to true');

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
      console.log('[MemeCanvas] Canvas zoom applied and resize listener added');

      // Event Listeners to maintain layer order
      const handleObjectSelected = () => {
        console.log('[MemeCanvas] Object selected, re-sorting layers.');
        sortCanvasByLayer();
      };

      const handleSelectionUpdated = () => {
        console.log('[MemeCanvas] Selection updated, re-sorting layers.');
        sortCanvasByLayer();
      };

      fabricCanvas.on('object:selected', handleObjectSelected);
      fabricCanvas.on('selection:updated', handleSelectionUpdated);

      // Initialize mainLayerNumberRef based on existing main stickers
      const initializeMainLayerNumber = () => {
        const mainObjects = fabricCanvas.getObjects().filter(obj => obj.category === 'Main');
        if (mainObjects.length === 0) {
          mainLayerNumberRef.current = 2;
        } else {
          const maxLayer = Math.max(...mainObjects.map(obj => obj.layerNumber));
          mainLayerNumberRef.current = maxLayer + 1;
        }
        console.log(`[MemeCanvas] Initialized mainLayerNumberRef to ${mainLayerNumberRef.current}`);
      };

      initializeMainLayerNumber();

      // Cleanup function
      return () => {
        console.log('[MemeCanvas] Disposing Fabric.js Canvas');
        fabricCanvas.off('object:selected', handleObjectSelected);
        fabricCanvas.off('selection:updated', handleSelectionUpdated);
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
        window.removeEventListener('resize', applyCanvasZoom);
        console.log('[MemeCanvas] Cleanup completed');
      };
    } else {
      console.warn('[MemeCanvas] Canvas initialization skipped');
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
      console.log('[MemeCanvas] Sorting canvas objects by layerNumber:');
      fabricCanvas.getObjects().forEach(obj => {
        console.log(`Object: ${obj.type}, layerNumber: ${obj.layerNumber}, category: ${obj.category}`);
      });

      const sortedObjects = fabricCanvas.getObjects().sort((a, b) => a.layerNumber - b.layerNumber);
      fabricCanvas.clear();
      sortedObjects.forEach(obj => fabricCanvas.add(obj));
      fabricCanvas.renderAll();
      console.log('[MemeCanvas] Canvas objects sorted and re-added.');
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
      console.log('[MemeCanvas] Attempting to load image from URL:', imageURL);
      const img = await Image.fromURL(imageURL, { crossOrigin: 'anonymous' });
  
      if (img && fabricCanvasRef.current) {
        console.log('[MemeCanvas] Image object successfully created from URL:', imageURL);
  
        const fabricCanvas = fabricCanvasRef.current;
        const isPFP = category === 'Goons: 3D'; // Adjust based on category logic
  
        // Assign layerNumber and category
        if (isPFP) {
          img.set({
            layerNumber: 1,
            category: 'Goons: 3D',
            selectable: true,  // Allow selection
            hasControls: true, // Show controls for resizing and rotation
          });
          console.log(`[MemeCanvas] Assigning layerNumber 1 to PFP sticker`);
        } else {
          img.set({
            layerNumber: mainLayerNumberRef.current,
            category: 'Main',
            selectable: true,
          });
          console.log(`[MemeCanvas] Assigning layerNumber ${mainLayerNumberRef.current} to Main sticker`);
          mainLayerNumberRef.current += 1;
          console.log(`[MemeCanvas] Incrementing mainLayerNumber to ${mainLayerNumberRef.current}`);
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
        console.log(isPFP ? '[MemeCanvas] PFP sticker added:' : '[MemeCanvas] Main sticker added:', img);
  
        // Sort canvas based on layerNumber to ensure PFP stays at the bottom
        sortCanvasByLayer();
      } else {
        console.error('[MemeCanvas] Image object creation failed for URL:', imageURL);
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
      console.log(`[MemeCanvas] Selected object: ${activeObject.type}, layerNumber: ${activeObject.layerNumber}, category: ${activeObject.category}`);

      // Prevent moving PFPs
      if (activeObject.layerNumber === 1) {
        console.log('[MemeCanvas] PFP sticker is fixed at the bottom layer and cannot be moved up.');
        return;
      }

      // Only allow moving Main category objects
      if (activeObject.category !== 'Main') {
        console.log('[MemeCanvas] Selected object is not a Main category object and cannot be moved.');
        return;
      }

      // Find the object with layerNumber = activeObject.layerNumber -1
      const objAbove = fabricCanvas.getObjects().find(obj => obj.layerNumber === activeObject.layerNumber - 1);
      if (objAbove && objAbove.category === 'Main') {
        console.log(`[MemeCanvas] Found Main object above to swap: ${objAbove.type}, layerNumber: ${objAbove.layerNumber}, category: ${objAbove.category}`);

        // Swap layerNumbers
        const tempLayer = activeObject.layerNumber;
        activeObject.layerNumber = objAbove.layerNumber;
        objAbove.layerNumber = tempLayer;

        console.log(`[MemeCanvas] Swapped layerNumbers: Selected object now layerNumber=${activeObject.layerNumber}, Object above now layerNumber=${objAbove.layerNumber}`);

        // Sort canvas based on new layerNumbers
        sortCanvasByLayer();
        console.log('[MemeCanvas] Moved selected object up a layer.');
      } else {
        console.log('[MemeCanvas] No Main object above to swap with.');
      }
    } else {
      console.log('[MemeCanvas] No active object selected.');
    }
  };

  // Function to move selected object down in layers
  const handleLayerDown = () => {
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      console.log(`[MemeCanvas] Selected object: ${activeObject.type}, layerNumber: ${activeObject.layerNumber}, category: ${activeObject.category}`);

      // Only allow moving Main category objects
      if (activeObject.category !== 'Main') {
        console.log('[MemeCanvas] Selected object is not a Main category object and cannot be moved.');
        return;
      }

      // Find the maximum layerNumber to prevent moving beyond top
      const maxLayer = Math.max(...fabricCanvas.getObjects().map(obj => obj.layerNumber));
      if (activeObject.layerNumber === maxLayer) {
        console.log('[MemeCanvas] Selected object is already at the top layer and cannot be moved down.');
        return;
      }

      // Find the object with layerNumber = activeObject.layerNumber +1
      const objBelow = fabricCanvas.getObjects().find(obj => obj.layerNumber === activeObject.layerNumber + 1);
      if (objBelow && objBelow.category === 'Main') {
        console.log(`[MemeCanvas] Found Main object below to swap: ${objBelow.type}, layerNumber: ${objBelow.layerNumber}, category: ${objBelow.category}`);

        // Swap layerNumbers
        const tempLayer = activeObject.layerNumber;
        activeObject.layerNumber = objBelow.layerNumber;
        objBelow.layerNumber = tempLayer;

        console.log(`[MemeCanvas] Swapped layerNumbers: Selected object now layerNumber=${activeObject.layerNumber}, Object below now layerNumber=${objBelow.layerNumber}`);

        // Sort canvas based on new layerNumbers
        sortCanvasByLayer();
        console.log('[MemeCanvas] Moved selected object down a layer.');
      } else {
        console.log('[MemeCanvas] No Main object below to swap with.');
      }
    } else {
      console.log('[MemeCanvas] No active object selected.');
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

      console.log(`[MemeCanvas] Assigning layerNumber ${mainLayerNumberRef.current} to new text object`);
      mainLayerNumberRef.current += 1;
      console.log(`[MemeCanvas] Incrementing mainLayerNumber to ${mainLayerNumberRef.current}`);

      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.renderAll();
      console.log('[MemeCanvas] Text added to canvas:', textInput);
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
      console.log('[MemeCanvas] Deleting selected object:', activeObject);
      fabricCanvas.remove(activeObject); // Remove the selected object
      fabricCanvas.renderAll();
      console.log('[MemeCanvas] Active object deleted from canvas.');
    } else {
      console.log('[MemeCanvas] No active object selected.');
    }
  };

  // Function to save/export the canvas as an image
  const handleSave = () => {
    const fabricCanvas = fabricCanvasRef.current;
  
    if (fabricCanvas) {
      console.log('[MemeCanvas] Saving canvas as image.');
  
      try {
        // Use toDataURL to get the image as a Data URL
        const dataURL = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
        });
  
        // Convert the Data URL to a Blob
        fetch(dataURL)
          .then(res => res.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'meme.png';
  
            // Detect if the device is mobile
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
            if (isMobile) {
              // Open the image in a new tab for mobile devices
              window.open(url, '_blank');
              console.log('[MemeCanvas] Image opened in a new tab for manual saving on mobile.');
            } else {
              // Trigger the download for desktop
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              console.log('[MemeCanvas] Canvas saved as meme.png.');
            }
  
            // Revoke the Blob URL after a short delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          })
          .catch(error => {
            console.error('[MemeCanvas] Error while saving canvas:', error);
            alert('Failed to download the image. This might be due to CORS restrictions on certain images.');
          });
      } catch (error) {
        console.error('[MemeCanvas] Error with toDataURL:', error);
        alert('Unable to export canvas. This is likely due to CORS issues with one or more images.');
      }
    }
  };
  

  // Function to handle font selection change
  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
    console.log(`[MemeCanvas] Selected font changed to: ${e.target.value}`);
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set('fontFamily', e.target.value);
      fabricCanvas.renderAll();
      console.log(`[MemeCanvas] FontFamily updated for selected text: ${e.target.value}`);
    }
  };

  // Function to handle color selection change
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    console.log(`[MemeCanvas] Selected color changed to: ${e.target.value}`);
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set('fill', e.target.value);
      fabricCanvas.renderAll();
      console.log(`[MemeCanvas] Text color updated for selected text: ${e.target.value}`);
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
    console.log('[MemeCanvas] Handling drop event.');

    const imageURL = e.dataTransfer.getData('text/plain');
    const category = e.dataTransfer.getData('application/category');
    console.log('[MemeCanvas] Received image URL from drop:', imageURL);
    console.log('[MemeCanvas] Received category from drop:', category);

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
    console.log('[MemeCanvas] Drag over canvas detected.');
  };

  const handleDragLeaveEvent = () => {
    setIsDragOver(false);
    console.log('[MemeCanvas] Drag leave canvas detected.');
  };

  useEffect(() => {
    const canvasContainer = canvasElementRef.current?.parentElement;
    if (!canvasContainer) {
      console.error('[MemeCanvas] canvasContainer is null.');
      return;
    }

    console.log('[MemeCanvas] Attempting to attach event listeners to canvas container.');
    canvasContainer.addEventListener('drop', handleDropEvent);
    console.log('[MemeCanvas] Drop event listener attached.');
    canvasContainer.addEventListener('dragover', handleDragOverEvent);
    console.log('[MemeCanvas] Dragover event listener attached.');
    canvasContainer.addEventListener('dragleave', handleDragLeaveEvent);
    console.log('[MemeCanvas] Dragleave event listener attached.');

    return () => {
      canvasContainer.removeEventListener('drop', handleDropEvent);
      canvasContainer.removeEventListener('dragover', handleDragOverEvent);
      canvasContainer.removeEventListener('dragleave', handleDragLeaveEvent);
      console.log('[MemeCanvas] Event listeners for drag-and-drop removed.');
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-black-04 rounded-xl shadow-2xl flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      {/* Controls Section */}
      <div className="flex flex-col w-full md:w-1/3 space-y-6">
        {/* Text Input */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="textInput" className="text-lg font-semibold text-white">
            Add Text
          </label>
          <input
            id="textInput"
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text to add to canvas"
            className="px-4 py-3 border border-grey-04 rounded-md shadow-sm bg-grey-01 text-white placeholder-grey-05 focus:outline-none focus:ring-2 focus:ring-orange transition"
            aria-label="Enter text to add to canvas"
          />
        </div>

        {/* Font and Color Selection */}
        <div className="flex flex-col space-y-4">
          {/* Font Selection */}
          <div className="flex items-center space-x-3">
            <PencilIcon className="h-5 w-5 text-grey-07" />
            <label htmlFor="fontSelect" className="text-white">
              Font:
            </label>
            <select
              id="fontSelect"
              value={selectedFont}
              onChange={handleFontChange}
              className="mt-1 block w-full py-2 px-3 border border-grey-04 bg-grey-02 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange text-white"
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
            <ColorSwatchIcon className="h-5 w-5 text-grey-07" />
            <label htmlFor="colorPicker" className="text-white">
              Text Color:
            </label>
            <input
              id="colorPicker"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="mt-1 block w-10 h-10 p-0 border-0 rounded-md focus:ring-2 focus:ring-orange"
              aria-label="Select color for text"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleAddText}
            className="flex items-center justify-center px-4 py-3 bg-orange text-black-01 rounded-md hover:bg-opacity-90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange"
            aria-label="Add text to canvas"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Text
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-4 py-3 bg-black-05 text-white rounded-md hover:bg-black-03 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black-03"
            aria-label="Delete selected object"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete Selected
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center px-4 py-3 bg-grey-05 text-black-01 rounded-md hover:bg-grey-06 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-grey-06"
            aria-label="Save canvas as image"
          >
            <SaveIcon className="h-5 w-5 mr-2" />
            Save
          </button>
          {/* Layer Control Buttons */}
          <button
            onClick={handleLayerUp}
            className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Move selected object up a layer"
          >
            <ArrowUpIcon className="h-5 w-5 mr-2" />
            Move Up Layer
          </button>
          <button
            onClick={handleLayerDown}
            className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Move selected object down a layer"
          >
            <ArrowDownIcon className="h-5 w-5 mr-2" />
            Move Down Layer
          </button>
        </div>
      </div>

      {/* Canvas Section */}
      <div className="flex-1 flex flex-col items-center">
        {/* Canvas Container */}
        <div
          className={`relative border-4 rounded-lg p-2 bg-grey-02 transition-all duration-200 ${
            isDragOver ? 'border-orange bg-black-03' : 'border-transparent'
          }`}
          aria-label="Meme Canvas Drop Area"
        >
          {/* Responsive Scaling Container */}
          <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[600px] lg:h-[600px] overflow-hidden">
            <canvas
              ref={canvasElementRef}
              className="w-full h-full border-2 border-dashed border-orange rounded-lg"
              width={600}
              height={600}
            />
            {isDragOver && (
              <div className="absolute inset-0 bg-orange bg-opacity-20 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-orange font-semibold">Drop here to add image</span>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-grey-06 text-center">
          Drag and drop images here or use the buttons to add text.
        </p>
      </div>
    </div>
  );

});

export default React.memo(MemeCanvas);
