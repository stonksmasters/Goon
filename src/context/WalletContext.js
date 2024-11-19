// src/context/WalletContext.js

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

// -----------------------
// 1. Create WalletContext
// -----------------------
const WalletContext = createContext({
  nfts: [],
  publicKey: null,
  loading: false,
  error: null,
});

// -----------------------
// 2. Custom Hook
// -----------------------
export const useWalletContext = () => useContext(WalletContext);

// -----------------------
// 3. WalletContextProvider
// -----------------------
const WalletContextProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet; // Use Mainnet for Magic Eden

  // Initialize wallet adapters using useMemo for performance optimization
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <SolanaWalletProvider wallets={wallets} autoConnect>
      <WalletContextConsumer>{children}</WalletContextConsumer>
    </SolanaWalletProvider>
  );
};

// -----------------------
// 4. WalletContextConsumer
// -----------------------
const WalletContextConsumer = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -----------------------
  // 4.1. Helper Function: Transform IPFS URLs
  // -----------------------
  const transformImageURL = (url) => {
    if (!url) return '';
    if (url.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${url.substring(7)}`;
    }
    return url;
  };

  // -----------------------
  // 4.2. Function to Fetch NFTs via Netlify Serverless Function
  // -----------------------
  const fetchNFTs = useCallback(async (walletAddress) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:8888/.netlify/functions/fetchTokens?wallet=${walletAddress}`
          : `/.netlify/functions/fetchTokens?wallet=${walletAddress}`; // Uses local server in dev

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Error fetching NFTs: ${response.statusText}`);
      }

      const nftData = await response.json();

      if (!Array.isArray(nftData)) {
        throw new Error('Unexpected NFT data format');
      }

      const fetchedNFTs = nftData.map((nft, index) => {
        let imageURL = transformImageURL(nft.image);
        let name = nft.name || `NFT #${index + 1}`;

        return {
          id: nft.mintAddress || `nft-${index}`,
          image: imageURL || 'https://via.placeholder.com/150',
          name,
        };
      });

      setNfts(fetchedNFTs);
    } catch (err) {
      setError(err.message);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------
  // 4.3. useEffect to Fetch NFTs on Wallet Connection
  // -----------------------
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      fetchNFTs(walletAddress);
    } else {
      setNfts([]);
      setError(null);
      setLoading(false);
    }
  }, [connected, publicKey, fetchNFTs]);

  // -----------------------
  // 4.4. Provide Context Value
  // -----------------------
  return (
    <WalletContext.Provider value={{ nfts, publicKey, loading, error }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
