// src/components/MemeGenerator/TextTools.js
import React, { useState } from 'react';

/**
 * TextTools component that allows users to add text to the meme canvas.
 *
 * @param {function} onAddText - Function to handle adding text.
 */
const TextTools = ({ onAddText }) => {
  const [text, setText] = useState(''); // Holds the input text

  /**
   * Handle form submission to add text.
   *
   * @param {object} e - The event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== '') {
      onAddText(text);
      setText('');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-goonsBlue mb-2">Add Text</h3>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your meme text"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-goonsGreen"
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-goonsGreen text-white rounded hover:bg-green-600 transition-colors duration-200"
        >
          Add Text
        </button>
      </form>
    </div>
  );
};

export default TextTools;
