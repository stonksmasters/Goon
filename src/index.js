import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WalletContextProvider from './context/WalletContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary'; // Add an error boundary component
import './index.css'; // Import Tailwind CSS or other global styles here

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <WalletContextProvider>
          <DndProvider backend={HTML5Backend}>
            <App />
          </DndProvider>
        </WalletContextProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
