// src/components/common/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Goons Community. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
