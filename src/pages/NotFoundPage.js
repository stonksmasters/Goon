// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="mt-20 text-center">
      <h1 className="text-5xl font-bold text-goonsRed">404</h1>
      <p className="mt-4 text-lg text-gray-700">Page Not Found</p>
      <Link to="/" className="mt-6 inline-block btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
