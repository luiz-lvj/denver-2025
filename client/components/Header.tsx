"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  LogOut,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ethers } from "ethers";
import { useWallet } from "../providers/WalletContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Available blockchain networks
const NETWORKS = [
  { id: "ethereum-mainnet", name: "Ethereum Mainnet", icon: "🔵", chainId: "0x1" },
  { id: "ethereum-sepolia", name: "Ethereum Sepolia", icon: "🟪", chainId: "0xaa36a7" },
  { id: "ethereum-goerli", name: "Ethereum Goerli", icon: "🟣", chainId: "0x5" },
  { id: "base-mainnet", name: "Base Mainnet", icon: "🔴", chainId: "0x2105" },
  { id: "base-testnet", name: "Base Goerli", icon: "🟠", chainId: "0x14a33" },
  { id: "mode-mainnet", name: "Mode Mainnet", icon: "🟢", chainId: "0x397" },
  { id: "mode-testnet", name: "Mode Testnet", icon: "🟡", chainId: "0x397c" },
];

export function Header() {
  const { 
    address, 
    setAddress, 
    selectedNetwork, 
    setSelectedNetwork, 
    provider,
    connecting,
    setConnecting
  } = useWallet();

  // State for disconnect confirmation dialog
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  // Handle network change
  const switchNetwork = async (network: typeof NETWORKS[0]) => {
    if (!window.ethereum) return;
    
    try {
      // Request network switch
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
      
      setSelectedNetwork(network);
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        alert(`Please add the ${network.name} network to your MetaMask wallet`);
      } else {
        console.error(`Error switching to ${network.name}:`, error);
      }
    }
  };

  const handleConnect = async () => {
    if (address) {
      // Show disconnect confirmation dialog instead of immediately disconnecting
      setShowDisconnectDialog(true);
      return;
    }

    if (!provider) {
      alert("Please install MetaMask to connect your wallet");
      return;
    }

    setConnecting(true);
    try {
      // Request account access using ethers.js
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  // Handle disconnect confirmation
  const confirmDisconnect = () => {
    setAddress(null);
    setShowDisconnectDialog(false);
  };

  // Helper to format address
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-white">WAaaS Chat</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Network selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700"
                disabled={!address}
              >
                <span className="mr-1">{selectedNetwork.icon}</span>
                {selectedNetwork.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
              {NETWORKS.map((network) => (
                <DropdownMenuItem 
                  key={network.id}
                  onClick={() => switchNetwork(network)}
                  className="text-zinc-100 hover:bg-zinc-700 hover:text-white cursor-pointer"
                >
                  <span className="mr-2">{network.icon}</span>
                  {network.name}
                </DropdownMenuItem>
              ))}
              {address && (
                <DropdownMenuItem 
                  onClick={useWallet().addSepoliaToMetaMask}
                  className="text-emerald-400 hover:bg-zinc-700 hover:text-emerald-300 cursor-pointer border-t border-zinc-700 mt-1 pt-1"
                >
                  <span className="mr-2">➕</span>
                  Add Sepolia to MetaMask
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Connect wallet button */}
          <Button
            onClick={handleConnect}
            disabled={connecting}
            variant={address ? "outline" : "default"}
            className={address 
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          >
            {connecting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : address ? (
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                {formatAddress(address)}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Disconnect confirmation dialog */}
      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Wallet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect your wallet? You will need to reconnect to use blockchain features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisconnect} className="bg-red-600 hover:bg-red-700">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 