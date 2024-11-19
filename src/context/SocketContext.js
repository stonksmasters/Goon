// src/context/SocketContext.jsx
import React, { createContext } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = io('http://localhost:5000'); // Replace with your backend URL

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};