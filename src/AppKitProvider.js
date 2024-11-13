// src/AppKitProvider.js
import { createAppKit } from '@reown/appkit/react';
import { mainnet, arbitrum } from '@reown/appkit/networks'; // Use only supported networks
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';

// Setup queryClient
const queryClient = new QueryClient();

const projectId = process.env.REACT_APP_PROJECT_ID || 'your_project_id_here';

const metadata = {
  name: 'GoonTool',
  description: 'AppKit Example',
  url: 'https://goontool.netlify.app', // Replace with your actual URL
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

const networks = [mainnet, arbitrum]; // Use only available networks

// Create the Solana adapter (assuming Solana integration only)
const solanaAdapter = new SolanaAdapter({
  networks,
  projectId,
  ssr: true,
});

// Initialize AppKit
createAppKit({
  adapters: [solanaAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

// AppKitProvider component
export function AppKitProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
