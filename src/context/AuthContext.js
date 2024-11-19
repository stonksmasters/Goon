import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle user login
  const login = async (walletAddress, username, signature) => {
    try {
      const response = await API.post('/auth/login', {
        walletAddress,
        username,
        signature,
      });
      const { token, userData } = response.data;
      setUser(userData);
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
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
          console.error('Failed to fetch user:', error.response?.data || error.message);
          logout(); // Clear invalid token and logout if fetch fails
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Function to refresh user token
  const refreshToken = async () => {
    try {
      const response = await API.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, loading }}>
      {!loading ? children : <div>Loading...</div>} {/* Optional loading state */}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
