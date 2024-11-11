import { createContext, useEffect } from 'react';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

export const WalletContext = createContext();

export const WalletContextProvider = ({ children }) => {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <WalletProvider wallets={wallets} autoConnect>
      {children}
    </WalletProvider>
  );
};
