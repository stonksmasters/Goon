// src/AppKitProvider.js
import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Initialize Query Client
const queryClient = new QueryClient();

// Environment variables
const projectId = process.env.REACT_APP_PROJECT_ID;
const apiUrl = process.env.REACT_APP_API_BASE_URL;

// Metadata for AppKit
const metadata = {
  name: 'GoonTool',
  description: 'AppKit Example',
  url: apiUrl, // Match your deployment URL here
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// Configure networks
const networks = [mainnet, arbitrum];

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional: enables analytics if configured in Reown Cloud
  },
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
