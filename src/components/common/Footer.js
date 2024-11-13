// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-goonsBlue text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Goons Community. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link to="/privacy" className="hover:text-white text-sm">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white text-sm">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-white text-sm">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
