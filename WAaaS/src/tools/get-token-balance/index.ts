// get-token-balance.ts

import { tool } from "@langchain/core/tools";
import { ethers } from "ethers";
import { rpcEndpoints } from "./rpc";
import { z } from "zod";

// ABI for ERC20 token - only includes balanceOf function
const minimalERC20ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "decimals", type: "uint8" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "symbol", type: "string" }],
    type: "function"
  }
];

// Hard-coded tokens for common examples
const TOKENS = {
  "dai": "0x6B175474E89094C44Da98b954EedeAC495271d0F"
};

/**
 * Retrieves a token balance for a given address on a specified chain and network
 */
export const getTokenBalance = tool(
  async (input: string) => {
    console.log("input", input);
    try {
      // Extract parameters from natural language or comma-separated format
      let tokenAddress, holderAddress, chain, network;
      
      // Try to parse as comma-separated values first
      const parts = input.split(",").map(item => item.trim());
      if (parts.length === 4) {
        [tokenAddress, holderAddress, chain, network] = parts;
      } else {
        // Try to extract parameters from natural language
        const inputLower = input.toLowerCase();
        
        // Extract token
        if (inputLower.includes("dai")) {
          tokenAddress = TOKENS.dai;
        }
        
        // Extract chain
        if (inputLower.includes("ethereum")) {
          chain = "ethereum";
        } else if (inputLower.includes("base")) {
          chain = "base";
        } else if (inputLower.includes("mode")) {
          chain = "mode";
        }
        
        // Extract network
        if (inputLower.includes("mainnet")) {
          network = "mainnet";
        } else if (inputLower.includes("testnet")) {
          network = "testnet";
        }
        
        // Extract wallet address (looking for 0x followed by alphanumeric)
        const addressMatch = input.match(/0x[a-fA-F0-9]{40}/);
        if (addressMatch) {
          holderAddress = addressMatch[0];
        }
      }
      
      // Validate inputs
      if (!tokenAddress || !holderAddress || !chain || !network) {
        return "Error: Missing required parameters. Need token address, holder address, chain, and network. Example: DAI,0x123...,ethereum,mainnet";
      }

      // Check if the requested chain and network are supported
      if (!rpcEndpoints[chain]) {
        return `Error: Unsupported chain '${chain}'. Supported chains are: ${Object.keys(rpcEndpoints).join(", ")}`;
      }

      if (!rpcEndpoints[chain][network]) {
        return `Error: Unsupported network '${network}' for chain '${chain}'. Supported networks are: mainnet, testnet`;
      }

      // Get the RPC URL from the mapping
      const providerUrl = rpcEndpoints[chain][network];

      // Create provider and connect to the token contract
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const tokenContract = new ethers.Contract(tokenAddress, minimalERC20ABI, provider);

      // Get token balance and metadata
      let balance, decimals, symbol;
      try {
        balance = await tokenContract.balanceOf(holderAddress);
        decimals = await tokenContract.decimals().catch(() => 18);
        symbol = await tokenContract.symbol().catch(() => "TOKEN");
      } catch (error) {
        return `Error accessing token contract: ${error}`;
      }

      // Format the balance with proper decimals
      const formattedBalance = ethers.formatUnits(balance, decimals);

      console.log("formattedBalance", formattedBalance);
      console.log("symbol", symbol);
      console.log("decimals", decimals);
      console.log("balance", balance);
      console.log("tokenAddress", tokenAddress);
      console.log("holderAddress", holderAddress);
      console.log("chain", chain);
      console.log("network", network);

      return `Token balance for ${holderAddress} on ${chain} ${network}: ${formattedBalance} ${symbol}`;
      
    } catch (error: any) {
      return `Error retrieving token balance: ${error.message}`;
    }
  },
  {
    name: "get_token_balance",
    description: "Retrieve a token balance for an address on a specific blockchain network",
    schema: z.string().describe("Natural language description of the token (e.g., 'DAI'), holder address, blockchain (ethereum/base/mode), and network (mainnet/testnet)"),
  }
);