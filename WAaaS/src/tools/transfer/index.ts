import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { transferAction } from "./action";

// Create the transfer tool with wrapper
export const transfer = createWaaaSTool(transferAction, {
  category: ToolCategory.ONCHAIN,
  description: "Transfer tokens between different blockchain networks",
  usage: "transfer({ sourceChain, destinationAddress, amount, tokenType, data })",
  examples: [
    "transfer({ sourceChain: 'ethereum', destinationAddress: '0x123...', amount: '0.1', tokenType: 'ETH' })",
    "transfer({ sourceChain: 'base', destinationAddress: '0x456...', amount: '0.05' })",
    "transfer({ sourceChain: 'arbitrum', destinationAddress: '0x789...', amount: '1.0', data: '0x...' })"
  ]
});

// Export metadata separately for compatibility with existing registry
export const metadata = {
  category: ToolCategory.ONCHAIN,
  description: "Transfer tokens between different blockchain networks",
  usage: "transfer({ sourceChain, destinationAddress, amount, tokenType, data })",
  examples: [
    "transfer({ sourceChain: 'ethereum', destinationAddress: '0x123...', amount: '0.1', tokenType: 'ETH' })",
    "transfer({ sourceChain: 'base', destinationAddress: '0x456...', amount: '0.05' })",
    "transfer({ sourceChain: 'arbitrum', destinationAddress: '0x789...', amount: '1.0', data: '0x...' })"
  ]
}; 