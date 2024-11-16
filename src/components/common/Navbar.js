// src/components/common/Navbar.js

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AuthContext } from '../../context/AuthContext';
import { MenuIcon, XIcon, ChevronDownIcon } from '@heroicons/react/outline';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="bg-black-03 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-neon-green hover:text-grey-07 transition-colors duration-300"
            >
              Goons Community
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/meme-generator"
              className="text-white hover:text-neon-green transition-colors duration-300"
            >
              Meme Generator
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-white hover:text-neon-green focus:outline-none"
                >
                  <span>{user.username}</span>
                  <ChevronDownIcon className="ml-1 h-5 w-5" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-grey-01 rounded-md shadow-lg py-1 z-20">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-grey-06 hover:bg-grey-04 hover:text-white rounded-md"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-grey-06 hover:bg-red-400 hover:text-white rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <WalletMultiButton className="bg-neon-green text-black-01 px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-300" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-neon-green focus:outline-none"
              aria-label="Toggle mobile menu"
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
        <div className="md:hidden bg-black-03 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/meme-generator"
            className="block text-white hover:bg-grey-04 hover:text-neon-green px-3 py-2 rounded-md text-base font-medium"
          >
            Meme Generator
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="block text-white hover:bg-grey-04 hover:text-neon-green px-3 py-2 rounded-md text-base font-medium"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left text-white hover:bg-red-400 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <WalletMultiButton className="block w-full text-left bg-neon-green text-black-01 px-3 py-2 rounded-md text-base font-medium hover:bg-opacity-90 transition-colors duration-300" />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
