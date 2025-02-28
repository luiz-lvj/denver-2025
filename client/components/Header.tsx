"use client";

import { useState } from "react";
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

// Available blockchain networks
const NETWORKS = [
  { id: "ethereum-mainnet", name: "Ethereum Mainnet", icon: "🔵" },
  { id: "ethereum-testnet", name: "Ethereum Testnet", icon: "🟣" },
  { id: "base-mainnet", name: "Base Mainnet", icon: "🔴" },
  { id: "base-testnet", name: "Base Testnet", icon: "🟠" },
  { id: "mode-mainnet", name: "Mode Mainnet", icon: "🟢" },
  { id: "mode-testnet", name: "Mode Testnet", icon: "🟡" },
];

export function Header() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

  const handleConnect = async () => {
    if (address) {
      // Disconnect wallet
      setAddress(null);
      return;
    }

    setIsConnecting(true);
    try {
      // This is a mock implementation - replace with your actual wallet connection logic
      if (typeof window !== "undefined" && "ethereum" in window) {
        const ethereum = (window as any).ethereum;
        
        // Request accounts
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      } else {
        alert("Please install a wallet like MetaMask to use this feature");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Helper to format address
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
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
                onClick={() => setSelectedNetwork(network)}
                className="text-zinc-100 hover:bg-zinc-700 hover:text-white cursor-pointer"
              >
                <span className="mr-2">{network.icon}</span>
                {network.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Connect wallet button */}
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          variant={address ? "outline" : "default"}
          className={address 
            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700"
            : "bg-blue-600 hover:bg-blue-700 text-white"
          }
        >
          {isConnecting ? (
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
  );
} 