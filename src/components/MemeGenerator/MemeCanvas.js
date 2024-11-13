// src/components/MemeGenerator/MemeCanvas.js

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Image, Text } from 'fabric';
import { useWalletContext } from '../../context/WalletContext';

const MemeCanvas = () => {
  const canvasElementRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const { nfts } = useWalletContext();
  const [isDragOver, setIsDragOver] = useState(false);
  
  // States for text customization
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Impact');

  console.log('[MemeCanvas] Component initialized');

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

      // Cleanup function to dispose of canvas on unmount
      return () => {
        console.log('[MemeCanvas] Disposing Fabric.js Canvas');
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
      };
    } else {
      console.warn('[MemeCanvas] Canvas initialization skipped');
    }
  }, []);

  // Add text to the canvas with custom color and font
  const handleAddText = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas && textInput.trim()) {
      const text = new Text(textInput, {
        left: fabricCanvas.width / 2,
        top: fabricCanvas.height / 2,
        originX: 'center',
        originY: 'center',
        fontSize: 24,
        fill: textColor,
        fontFamily: fontFamily,
        selectable: true,
      });

      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.renderAll();
      console.log('[MemeCanvas] Text added to canvas:', textInput);
      setTextInput('');  // Clear the input field after adding text
    }
  };

  // Delete the selected object from the canvas
  const handleDelete = () => {
    const fabricCanvas = fabricCanvasRef.current;
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
      console.log('[MemeCanvas] Active object deleted from canvas');
    } else {
      console.log('[MemeCanvas] No active object selected');
    }
  };

  // Save the canvas as an image
  const handleSaveImage = () => {
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
      console.log('[MemeCanvas] Canvas saved as image');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log('[MemeCanvas] Handling drop event');

    const imageURL = e.dataTransfer.getData('text/plain');
    console.log('[MemeCanvas] Received image URL from drop:', imageURL);

    if (!imageURL) {
      console.warn('[MemeCanvas] No image URL found in drop data');
      return;
    }

    try {
      console.log('[MemeCanvas] Attempting to load image from URL...');
      const img = await Image.fromURL(imageURL, { crossOrigin: 'anonymous' });

      if (img && fabricCanvasRef.current) {
        console.log('[MemeCanvas] Image object successfully created from URL:', imageURL);

        img.set({
          left: fabricCanvasRef.current.width / 2,
          top: fabricCanvasRef.current.height / 2,
          originX: 'center',
          originY: 'center',
          selectable: true,
        });

        img.scaleToWidth(150);
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        fabricCanvasRef.current.renderAll();
        console.log('[MemeCanvas] Image added and rendered on canvas:', imageURL);
      } else {
        console.error('[MemeCanvas] Image object creation failed');
      }
    } catch (error) {
      console.error('[MemeCanvas] Error loading image from URL:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
    console.log('[MemeCanvas] Drag over canvas detected');
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
    console.log('[MemeCanvas] Drag leave canvas detected');
  };

  useEffect(() => {
    const canvasElement = canvasElementRef.current;
    if (!canvasElement) {
      console.error('[MemeCanvas] canvasElementRef is null');
      return;
    }

    console.log('[MemeCanvas] Attempting to attach event listeners to canvas element');
    canvasElement.addEventListener('drop', handleDrop);
    console.log('[MemeCanvas] Drop event listener attached');
    canvasElement.addEventListener('dragover', handleDragOver);
    console.log('[MemeCanvas] Dragover event listener attached');
    canvasElement.addEventListener('dragleave', handleDragLeave);
    console.log('[MemeCanvas] Dragleave event listener attached');

    return () => {
      canvasElement.removeEventListener('drop', handleDrop);
      canvasElement.removeEventListener('dragover', handleDragOver);
      canvasElement.removeEventListener('dragleave', handleDragLeave);
      console.log('[MemeCanvas] Event listeners for drag-and-drop removed');
    };
  }, []);

  return (
    <div className="w-3/4 h-full p-4 bg-gray-200 relative">
      {/* Text Input and Options */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text"
          className="px-4 py-2 border rounded"
        />
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="Impact">Impact</option>
          <option value="Arial">Arial</option>
          <option value="Comic Sans MS">Comic Sans</option>
        </select>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="border rounded"
        />
        <button onClick={handleAddText} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Text
        </button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
          Delete Selected
        </button>
        <button onClick={handleSaveImage} className="px-4 py-2 bg-green-500 text-white rounded">
          Save Image
        </button>
      </div>

      {/* Canvas Container */}
      <div
        onDrop={handleDrop} 
        onDragOver={(e) => e.preventDefault()} 
        className={`relative border-2 ${isDragOver ? 'border-blue-500' : 'border-transparent'}`}
      >
        <canvas ref={canvasElementRef} style={{ border: '2px dashed blue' }} />
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100 opacity-50 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default MemeCanvas;
