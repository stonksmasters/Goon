// src/components/MemeGenerator/MemeCanvas.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import './MemeCanvas.css'; // Create this CSS file for styling

const MemeCanvas = () => {
  const [elements, setElements] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'sticker',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      addElement(item, offset);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), []);

  const addElement = (item, offset) => {
    // Calculate position relative to the canvas
    const canvas = document.getElementById('meme-canvas');
    const rect = canvas.getBoundingClientRect();
    const top = offset.y - rect.top - 50; // Adjust for sticker size
    const left = offset.x - rect.left - 50;

    setElements((prevElements) => [
      ...prevElements,
      {
        id: item.id,
        imageUrl: item.imageUrl,
        top,
        left,
      },
    ]);
  };

  return (
    <div
      id="meme-canvas"
      ref={drop}
      className="meme-canvas"
      style={{ border: isOver ? '2px dashed #4CAF50' : '2px dashed #ccc' }}
    >
      {elements.map((el, index) => (
        <img
          key={index}
          src={el.imageUrl}
          alt={`sticker-${index}`}
          className="meme-element"
          style={{ top: el.top, left: el.left }}
        />
      ))}
    </div>
  );
};

export default MemeCanvas;
