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
    console.log('transformImageURL called with:', url); // Debug
    if (!url) {
      console.warn('Received empty URL for image.');
      return '';
    }
    if (url.startsWith('ipfs://')) {
      const transformedURL = `https://ipfs.io/ipfs/${url.substring(7)}`;
      console.log('Transformed IPFS URL to HTTP:', transformedURL);
      return transformedURL;
    }
    return url;
  };

  // -----------------------
  // 4.2. Function to Fetch NFTs via Netlify Serverless Function
  // -----------------------
  const fetchNFTs = useCallback(async (walletAddress) => {
    console.log('=== NFT Fetch Initiated ===');
    console.log('Wallet Address:', walletAddress);

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `/.netlify/functions/fetchTokens?wallet=${walletAddress}`; // Updated to use Netlify serverless function
      console.log('Fetching NFTs from:', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        console.error(errorMessage);
        setError(errorMessage);
        setNfts([]);
        setLoading(false);
        return;
      }

      const nftData = await response.json();
      console.log('Raw NFT Data:', nftData);

      if (!Array.isArray(nftData)) {
        const errorMessage =
          'Unexpected NFT data format received from serverless function.';
        console.error(errorMessage);
        setError(errorMessage);
        setNfts([]);
        setLoading(false);
        return;
      }

      // Transform NFT data to extract necessary fields
      const fetchedNFTs = nftData.map((nft, index) => {
        console.log(`Processing NFT ${index + 1}:`, nft);
        let imageURL = nft.image;
        let name = nft.name || `NFT #${index + 1}`;

        console.log(`Original image URL: ${imageURL}`);

        // Transform the image URL if it's an IPFS link
        imageURL = transformImageURL(imageURL);
        console.log(`Transformed image URL: ${imageURL}`);

        if (!imageURL) {
          console.warn(
            `NFT ${index + 1} (${nft.mintAddress}) has no valid image URL.`
          );
        } else {
          console.log(
            `NFT ${index + 1} (${nft.mintAddress}):`,
            { id: nft.mintAddress, image: imageURL, name },
            '\n'
          );
        }

        return {
          id: nft.mintAddress || `nft-${index}`, // Unique identifier
          image: imageURL || 'https://via.placeholder.com/150', // Fallback image URL
          name: name,
        };
      });

      console.log('Transformed NFT Data:', fetchedNFTs);
      setNfts(fetchedNFTs);
    } catch (err) {
      console.error('Error during NFT fetching:', err);
      setError('An error occurred while fetching NFTs.');
      setNfts([]);
    } finally {
      setLoading(false);
      console.log('=== NFT Fetch Completed ===');
    }
  }, []);

  // -----------------------
  // 4.3. useEffect to Fetch NFTs on Wallet Connection
  // -----------------------
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toBase58();
      console.log('Wallet connected:', walletAddress);
      fetchNFTs(walletAddress);
    } else {
      console.log('Wallet disconnected or no publicKey.');
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
