import { z } from "zod";
import { WaaaSAction } from "../types";
import { ethers } from "ethers";
import { rpcEndpoints } from "./rpc";

// ABI for ERC20 token
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
const TOKENS: Record<string, string> = {
  "dai": "0x6B175474E89094C44Da98b954EedeAC495271d0F"
};

// Define the schema for the token balance tool
export const TokenBalanceSchema = z.object({
  tokenAddress: z.string().describe("The contract address of the token"),
  holderAddress: z.string().describe("The address holding the tokens"),
  chain: z.string().describe("The blockchain to query (ethereum, base, mode)"),
  network: z.string().describe("The network to query (mainnet, testnet)")
}).strict();

// Create the implementation function
async function getTokenBalanceFunc(
  args: z.infer<typeof TokenBalanceSchema>
): Promise<string> {
  const { tokenAddress, holderAddress, chain, network } = args;
  
  try {
    // Validate inputs
    if (!tokenAddress || !holderAddress || !chain || !network) {
      return "Error: Missing required parameters. Need token address, holder address, chain, and network.";
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

    return `Token balance for ${holderAddress} on ${chain} ${network}: ${formattedBalance} ${symbol}`;
    
  } catch (error: any) {
    return `Error retrieving token balance: ${error.message}`;
  }
}

// The token balance tool description
const TOKEN_BALANCE_PROMPT = `
This tool retrieves a token balance for a given address on a specified chain and network.

Required inputs:
- tokenAddress: The contract address of the token (e.g., "0x6B175474E89094C44Da98b954EedeAC495271d0F" for DAI)
- holderAddress: The address holding the tokens
- chain: The blockchain to query (ethereum, base, mode)
- network: The network to query (mainnet, testnet)

Important notes:
- For common tokens like DAI, you can use their name instead of the contract address
- The holderAddress must be a valid Ethereum address
- Supported chains: ethereum, base, mode
- Supported networks: mainnet, testnet
`;

// Export the token balance action
export const tokenBalanceAction: WaaaSAction<typeof TokenBalanceSchema> = {
  name: "get_token_balance",
  description: TOKEN_BALANCE_PROMPT,
  schema: TokenBalanceSchema,
  func: getTokenBalanceFunc
}; 