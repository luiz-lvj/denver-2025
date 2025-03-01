import { z } from "zod";
import { WaaaSAction } from "../types";
import { ethers } from "ethers";
import { EthereumConfig } from "./ethereum_config";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define the supported chains and their RPC endpoints
const chainConfig: Record<string, { rpc: string; chainId: number }> = {
  ethereum: {
    rpc: "https://eth.llamarpc.com",
    chainId: 1
  },
  base: {
    rpc: "https://mainnet.base.org",
    chainId: 8453
  },
  mode: {
    rpc: "https://mainnet.mode.network",
    chainId: 34443
  },
  arbitrum: {
    rpc: "https://arb1.arbitrum.io/rpc",
    chainId: 42161
  },
  optimism: {
    rpc: "https://mainnet.optimism.io",
    chainId: 10
  }
};

// Define the schema for the transfer tool
export const TransferSchema = z.object({
  sourceChain: z.string().describe("The source blockchain for the transfer (ethereum, base, mode, arbitrum, optimism)"),
  destinationAddress: z.string().describe("The destination wallet address to receive the tokens"),
  amount: z.string().describe("The amount to transfer (e.g., '0.1')"),
  tokenType: z.string().optional().describe("The token type to transfer (e.g., 'ETH', defaults to native token)"),
  data: z.string().optional().describe("Optional data to include with the transaction")
}).strict();

// Create the implementation function
async function transferFunc(
  args: z.infer<typeof TransferSchema>
): Promise<string> {
  const { sourceChain, destinationAddress, amount, tokenType = "ETH", data = "" } = args;
  
  try {
    // Validate the source chain
    if (!chainConfig[sourceChain.toLowerCase()]) {
      return `Error: Unsupported source chain '${sourceChain}'. Supported chains are: ${Object.keys(chainConfig).join(", ")}`;
    }

    // Validate the destination address
    if (!ethers.isAddress(destinationAddress)) {
      return `Error: Invalid destination address '${destinationAddress}'`;
    }

    // Parse the amount
    let parsedAmount;
    try {
      parsedAmount = ethers.parseEther(amount);
    } catch (error) {
      return `Error: Invalid amount '${amount}'. Please provide a valid number.`;
    }

    // Get the private key from the config
    let privateKey;
    try {
      privateKey = EthereumConfig.getInstance().getPrivateKey();
    } catch (error: any) {
      return `Error: ${error.message}`;
    }

    // Get the chain configuration
    const chain = chainConfig[sourceChain.toLowerCase()];
    
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(chain.rpc);
    const wallet = new ethers.Wallet(privateKey, provider);
    const walletAddress = wallet.address;

    // Check if we're transferring the native token or an ERC20 token
    if (tokenType.toUpperCase() === "ETH" || tokenType.toUpperCase() === "NATIVE") {
      // Check wallet balance
      const balance = await provider.getBalance(walletAddress);
      if (balance < parsedAmount) {
        return `Error: Insufficient balance. Available: ${ethers.formatEther(balance)} ETH, Required: ${amount} ETH`;
      }

      // Prepare the transaction
      const tx = {
        to: destinationAddress,
        value: parsedAmount,
        data: data || "0x",
        chainId: chain.chainId
      };

      // Send the transaction
      const txResponse = await wallet.sendTransaction(tx);
      return `Transaction sent: ${txResponse.hash}. Transferring ${amount} ${tokenType} from ${sourceChain} to ${destinationAddress}`;
    } else {
      // For ERC20 tokens, we would need the token contract address and ABI
      return `Error: Transfer of tokens other than the native token (${tokenType}) is not implemented yet`;
    }
  } catch (error: any) {
    return `Error executing transfer: ${error.message}`;
  }
}

// The transfer tool description
const TRANSFER_PROMPT = `
This tool transfers tokens between different blockchain networks.

Required inputs:
- sourceChain: The source blockchain for the transfer (ethereum, base, mode, arbitrum, optimism)
- destinationAddress: The destination wallet address to receive the tokens
- amount: The amount to transfer (e.g., '0.1')

Optional inputs:
- tokenType: The token type to transfer (e.g., 'ETH', defaults to native token)
- data: Optional data to include with the transaction

Important notes:
- Currently only supports native token transfers (ETH, etc.)
- The sender address is determined by the configured private key
- Supported chains: ethereum, base, mode, arbitrum, optimism
- Example: Transfer 0.1 ETH from Ethereum to address 0x123...
`;

// Export the transfer action
export const transferAction: WaaaSAction<typeof TransferSchema> = {
  name: "transfer",
  description: TRANSFER_PROMPT,
  schema: TransferSchema,
  func: transferFunc
}; 