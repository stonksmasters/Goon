// src/components/common/Navbar.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AuthContext } from '../../context/AuthContext';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Ensure Heroicons are installed

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-goonsBlue shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Goons Community
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/meme-generator" className="text-white hover:text-gray-200">
              Meme Generator
            </Link>
            <Link to="/council" className="text-white hover:text-gray-200">
              Council
            </Link>
            <Link to="/flash-events" className="text-white hover:text-gray-200">
              Flash Events
            </Link>
            <Link to="/feed" className="text-white hover:text-gray-200">
              Feed
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-white hover:text-gray-200">
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <WalletMultiButton className="bg-white text-goonsBlue px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
            >
              {isMobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-goonsBlue px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/meme-generator" className="block text-white hover:bg-goonsGreen hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Meme Generator
          </Link>
          <Link to="/council" className="block text-white hover:bg-goonsGreen hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Council
          </Link>
          <Link to="/flash-events" className="block text-white hover:bg-goonsGreen hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Flash Events
          </Link>
          <Link to="/feed" className="block text-white hover:bg-goonsGreen hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Feed
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="block text-white hover:bg-goonsGreen hover:text-white px-3 py-2 rounded-md text-base font-medium">
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left text-white hover:bg-red-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <WalletMultiButton className="block w-full text-left bg-white text-goonsBlue px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100" />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
