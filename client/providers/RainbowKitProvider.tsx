"use client";

import { ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider as RKProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia, base, baseGoerli } from 'wagmi/chains';
import { http } from 'wagmi';
import dotenv from 'dotenv';

dotenv.config();

// Define MODE chains
const modeMainnet = {
  id: 919,
  name: 'Mode',
  network: 'mode',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.mode.network'] },
    public: { http: ['https://mainnet.mode.network'] },
  },
  blockExplorers: {
    default: { name: 'ModeExplorer', url: 'https://explorer.mode.network' },
  }
} as const;

const modeTestnet = {
  id: 926,
  name: 'Mode Testnet',
  network: 'mode-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.mode.network'] },
    public: { http: ['https://sepolia.mode.network'] },
  },
  blockExplorers: {
    default: { name: 'ModeExplorer', url: 'https://sepolia.explorer.mode.network' },
  },
  testnet: true,
} as const;

// Use the project ID from the environment variable
const WALLET_CONNECT_PROJECT_ID = `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`;

// Create the configuration using the new getDefaultConfig API
const config = getDefaultConfig({
  appName: 'WAaaS Chat',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia, mainnet, base, baseGoerli, modeMainnet, modeTestnet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseGoerli.id]: http(),
    [modeMainnet.id]: http(),
    [modeTestnet.id]: http(),
  },
});

// Setup query client for data fetching
const queryClient = new QueryClient();

export function RainbowKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RKProvider initialChain={sepolia.id}>
          {children}
        </RKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Export this helper to use throughout the app
export const NETWORK_ICONS: Record<number, string> = {
  1: "🔵", // Ethereum mainnet
  11155111: "🟪", // Sepolia
  8453: "🔴", // Base mainnet
  84531: "🟠", // Base Goerli
  919: "🟢", // Mode mainnet
  926: "🟡", // Mode testnet
}; 