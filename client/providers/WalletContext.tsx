"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { ethers } from "ethers";

type NetworkType = {
  id: string;
  name: string;
  icon: string;
  chainId: string;
};

type WalletContextType = {
  address: string | null;
  setAddress: (address: string | null) => void;
  selectedNetwork: NetworkType;
  setSelectedNetwork: (network: NetworkType) => void;
  provider: ethers.BrowserProvider | null;
  connecting: boolean;
  setConnecting: (connecting: boolean) => void;
  addSepoliaToMetaMask: () => Promise<void>;
};

// Default values
const defaultNetwork = {
  id: "ethereum-sepolia", 
  name: "Ethereum Sepolia",
  icon: "🟪",
  chainId: "0xaa36a7"
};

const WalletContext = createContext<WalletContextType>({
  address: null,
  setAddress: () => {},
  selectedNetwork: defaultNetwork,
  setSelectedNetwork: () => {},
  provider: null,
  connecting: false,
  setConnecting: () => {},
  addSepoliaToMetaMask: async () => {}
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(defaultNetwork);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Helper function to add Sepolia network to MetaMask
  const addSepoliaToMetaMask = async () => {
    if (!window.ethereum) {
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
    } catch (error) {
      console.error("Error adding Sepolia network:", error);
    }
  };

  // Initialize provider on component mount if window is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
      
      // Check if already connected
      ethersProvider.listAccounts().then(accounts => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0].address);
          
          // Try to get the current chain ID
          window.ethereum.request({ method: 'eth_chainId' })
            .then((chainId: string) => {
              // Find the network that matches this chain ID
              const network = Object.values(NETWORKS).find(n => n.chainId.toLowerCase() === chainId.toLowerCase());
              if (network) {
                setSelectedNetwork(network);
              }
            })
            .catch(console.error);
        }
      }).catch(err => {
        console.error("Error checking accounts:", err);
      });
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
        } else {
          setAddress(accounts[0]);
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        // Find the network that matches this chain ID
        const network = Object.values(NETWORKS).find(n => n.chainId.toLowerCase() === chainId.toLowerCase());
        if (network) {
          setSelectedNetwork(network);
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        setAddress,
        selectedNetwork,
        setSelectedNetwork,
        provider,
        connecting,
        setConnecting,
        addSepoliaToMetaMask
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// Available blockchain networks (duplicated from Header for convenience in this context)
const NETWORKS = {
  "ethereum-mainnet": { id: "ethereum-mainnet", name: "Ethereum Mainnet", icon: "🔵", chainId: "0x1" },
  "ethereum-sepolia": { id: "ethereum-sepolia", name: "Ethereum Sepolia", icon: "🟪", chainId: "0xaa36a7" },
  "base-mainnet": { id: "base-mainnet", name: "Base Mainnet", icon: "🔴", chainId: "0x2105" },
  "base-testnet": { id: "base-testnet", name: "Base Goerli", icon: "🟠", chainId: "0x14a33" },
  "mode-mainnet": { id: "mode-mainnet", name: "Mode Mainnet", icon: "🟢", chainId: "0x397" },
  "mode-testnet": { id: "mode-testnet", name: "Mode Testnet", icon: "🟡", chainId: "0x397c" }
}; 