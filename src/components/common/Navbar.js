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
    <nav className="bg-black-03 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-orange hover:text-grey-07 transition-colors duration-300">
              Goons Community
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/meme-generator" className="text-white hover:text-orange transition-colors duration-300">
              Meme Generator
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-white hover:text-orange transition-colors duration-300">
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:text-red-400 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <WalletMultiButton className="bg-orange text-black-01 px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-300" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-orange focus:outline-none focus:text-orange transition-colors duration-300"
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
          <Link to="/meme-generator" className="block text-white hover:bg-grey-04 hover:text-orange px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
            Meme Generator
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="block text-white hover:bg-grey-04 hover:text-orange px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left text-white hover:bg-red-400 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <WalletMultiButton className="block w-full text-left bg-orange text-black-01 px-3 py-2 rounded-md text-base font-medium hover:bg-opacity-90 transition-colors duration-300" />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
