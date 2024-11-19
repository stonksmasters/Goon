// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const login = async (walletAddress, username, signature) => {
    try {
      const response = await API.post('/auth/login', {
        walletAddress,
        username,
        signature,
      });
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Fetch user data on component mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await API.get('/users/me'); // Ensure this endpoint exists in backend
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          logout();
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);