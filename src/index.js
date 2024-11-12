// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WalletContextProvider from './context/WalletContext';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Ensure Tailwind CSS is imported

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <WalletContextProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </WalletContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
