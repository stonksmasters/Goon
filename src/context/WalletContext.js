// src/context/WalletContext.js
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Connection } from '@solana/web3.js';
import {
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

// Create WalletContext for managing wallet state and NFTs
export const WalletContext = createContext();

const WalletContextProvider = ({ children }) => {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);
  const network = WalletAdapterNetwork.Devnet; // Set your desired network
  const connection = useMemo(() => new Connection('https://api.devnet.solana.com'), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  // Function to fetch NFTs based on the connected wallet
  const fetchNFTs = useCallback(async (walletAddress) => {
    try {
      if (!walletAddress) return;
      
      const response = await fetch(`https://api-mainnet.magiceden.dev/v2/wallets/${walletAddress}/tokens?type=solana`);
      const nftData = await response.json();
      
      // Extract NFT images and names to use in the StickerPanel
      const fetchedNFTs = nftData.map(nft => ({
        image: nft.metadata?.image,
        name: nft.metadata?.name,
      }));
      
      setNfts(fetchedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, []);

  // Fetch NFTs when wallet connection changes
  useEffect(() => {
    if (publicKey) {
      fetchNFTs(publicKey.toString());
    }
  }, [publicKey, fetchNFTs]);

  return (
    <WalletContext.Provider value={{ nfts, publicKey }}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {children}
      </SolanaWalletProvider>
    </WalletContext.Provider>
  );
};

// Custom hook for consuming WalletContext
export const useWalletContext = () => useContext(WalletContext);

export default WalletContextProvider;
