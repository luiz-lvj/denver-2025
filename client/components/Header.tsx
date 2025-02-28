"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NETWORK_ICONS } from '../providers/RainbowKitProvider';
import { useWalletAdapter } from '../hooks/useWalletAdapter';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from 'react';

export function Header() {
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  // Still use our adapter to access the addSepoliaToMetaMask function
  const { address, addSepoliaToMetaMask } = useWalletAdapter();
  
  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 shadow-md">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-white">WAaaS Chat</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Network tools - only show when mounted to prevent hydration issues */}
        {mounted && address && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700">
                <span className="mr-1">⚙️</span>
                Network Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem 
                onClick={addSepoliaToMetaMask}
                className="text-emerald-400 hover:bg-zinc-700 hover:text-emerald-300 cursor-pointer"
              >
                <span className="mr-2">➕</span>
                Add Sepolia to MetaMask
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Only render the ConnectButton when component is mounted */}
        {mounted ? (
          <ConnectButton 
            chainStatus="icon" 
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        ) : (
          // Placeholder while loading to prevent hydration mismatch
          <div className="h-10 w-36 bg-zinc-800 rounded-md"></div>
        )}
      </div>
    </header>
  );
} 