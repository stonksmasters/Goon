// src/components/common/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-goonsBlue">
          Goons Community
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/meme-generator" className="text-gray-700 hover:text-goonsBlue">
            Meme Generator
          </Link>
          <Link to="/council" className="text-gray-700 hover:text-goonsBlue">
            Council
          </Link>
          <Link to="/flash-events" className="text-gray-700 hover:text-goonsBlue">
            Flash Events
          </Link>
          <Link to="/feed" className="text-gray-700 hover:text-goonsBlue">
            Feed
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-goonsBlue">
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <WalletMultiButton className="btn-primary" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
