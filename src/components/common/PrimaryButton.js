// src/components/common/PrimaryButton.js
import React from 'react';

const PrimaryButton = ({ children, onClick, className, ...props }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center px-4 py-3 bg-neon-green text-black-01 rounded-md hover:bg-opacity-90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default PrimaryButton;
