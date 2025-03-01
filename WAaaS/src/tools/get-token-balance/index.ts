// get-token-balance.ts

import { createWaaaSTool } from "../WaaaSToolWrapper";
import { tokenBalanceAction } from "./action";
import { ToolCategory } from "../../registry/types";

// Create the token balance tool using the WaaaSToolWrapper
export const getTokenBalance = createWaaaSTool(tokenBalanceAction, {
  category: ToolCategory.ONCHAIN,
  description: "Retrieve a token balance for a given address on a specified chain and network",
  usage: "get_token_balance('tokenAddress', 'holderAddress', 'chain', 'network')",
  examples: [
    "get_token_balance('DAI', '0x123...', 'ethereum', 'mainnet')",
    "get_token_balance('0x6B175474E89094C44Da98b954EedeAC495271d0F', '0x123...', 'ethereum', 'mainnet')",
    "get_token_balance('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', '0x123...', 'base', 'mainnet')"
  ]
});

// Export metadata for the registry
export const metadata = {
  name: getTokenBalance.name,
  description: getTokenBalance.description,
  category: ToolCategory.ONCHAIN,
  usage: "get_token_balance('tokenAddress', 'holderAddress', 'chain', 'network')",
  examples: [
    "get_token_balance('DAI', '0x123...', 'ethereum', 'mainnet')",
    "get_token_balance('0x6B175474E89094C44Da98b954EedeAC495271d0F', '0x123...', 'ethereum', 'mainnet')",
    "get_token_balance('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', '0x123...', 'base', 'mainnet')"
  ]
};