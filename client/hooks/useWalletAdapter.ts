"use client";

import { useAccount, useDisconnect, usePublicClient, useChainId, useConfig, useSwitchChain } from 'wagmi';
import { NETWORK_ICONS } from '../providers/RainbowKitProvider';
import { useEffect, useState } from 'react';

// Format similar to our legacy wallet context
export interface WalletAdapter {
  address: string | null;
  selectedNetwork: {
    id: string;
    name: string;
    icon: string;
    chainId: string;
  };
  provider: any;
  connecting: boolean;
  disconnect: () => void;
  addSepoliaToMetaMask?: () => Promise<void>;
}

// Network ID mapping for legacy compatibility
const NETWORK_ID_MAP: Record<number, string> = {
  1: "ethereum-mainnet",
  11155111: "ethereum-sepolia",
  8453: "base-mainnet",
  84531: "base-testnet",
  919: "mode-mainnet",
  926: "mode-testnet"
};

// Default network info to prevent hydration mismatches
const DEFAULT_NETWORK = {
  id: "ethereum-sepolia",
  name: "Ethereum Sepolia",
  icon: "🟪",
  chainId: "0xaa36a7",
};

export function useWalletAdapter(): WalletAdapter {
  // Create state to ensure client-side only rendering
  const [mounted, setMounted] = useState(false);
  
  // Use hooks that depend on browser APIs
  const { address, isConnecting, chain } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const publicClient = usePublicClient();
  const { switchChain } = useSwitchChain();
  const { chains } = useConfig();

  // Set mounted state after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to add Sepolia to MetaMask
  const addSepoliaToMetaMask = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xaa36a7',
            chainName: 'Ethereum Sepolia',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'SEP',
              decimals: 18,
            },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/'],
          },
        ],
      });
      console.log("Sepolia network added to MetaMask");
      // Switch to Sepolia network
      if (switchChain) {
        switchChain({ chainId: 11155111 }); // Sepolia chain ID
      }
    } catch (error) {
      console.error("Error adding Sepolia network:", error);
    }
  };

  // If not mounted yet, return default values to prevent hydration mismatch
  if (!mounted) {
    return {
      address: null,
      selectedNetwork: DEFAULT_NETWORK,
      provider: null,
      connecting: false,
      disconnect: () => {},
      addSepoliaToMetaMask,
    };
  }

  // Find current chain info from the chains array
  const currentChain = chain || chains.find(c => c.id === 11155111) || chains[0];
  const currentChainId = currentChain?.id || 11155111;

  // Build network information
  const networkInfo = {
    id: NETWORK_ID_MAP[currentChainId] || "ethereum-sepolia",
    name: currentChain?.name || "Ethereum Sepolia",
    icon: NETWORK_ICONS[currentChainId] || "🟪",
    chainId: `0x${currentChainId.toString(16)}`, // Convert to hex format
  };

  return {
    address: address || null,
    selectedNetwork: networkInfo,
    provider: publicClient,
    connecting: isConnecting,
    disconnect,
    addSepoliaToMetaMask,
  };
} 