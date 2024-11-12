// src/components/common/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <button onClick={onClose} className="float-right text-gray-600 hover:text-gray-800">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
