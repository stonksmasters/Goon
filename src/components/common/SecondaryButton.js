// src/components/common/SecondaryButton.js
import React from 'react';

const SecondaryButton = ({ children, onClick, className, ...props }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center px-4 py-3 bg-grey-03 text-white rounded-md hover:bg-grey-02 transition duration-300 focus:outline-none focus:ring-2 focus:ring-grey-04 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default SecondaryButton;
