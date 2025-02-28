import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolCategory } from "../../registry/types";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Create the Coinbase AgentKit tool
export const coinbaseAgentkit = tool(
  async ({ operation, assetPair, amount, side }) => {
    // Check for API credentials (in a real implementation)
    if (!process.env.COINBASE_API_KEY || !process.env.COINBASE_API_SECRET) {
      return "Error: Coinbase API credentials not configured. Please set COINBASE_API_KEY and COINBASE_API_SECRET environment variables.";
    }

    // Handle different operations
    switch (operation) {
      case "check_price":
        if (!assetPair) {
          return "Error: Asset pair is required for price check (e.g., 'BTC-USD')";
        }
        // Simulate price check (would use actual API in production)
        const randomPrice = (Math.random() * 10000 + 20000).toFixed(2);
        return `Current price for ${assetPair}: $${randomPrice}`;

      case "get_portfolio":
        // Simulate portfolio data (would use actual API in production)
        return JSON.stringify({
          totalValue: "$42,568.93",
          assets: [
            { asset: "BTC", amount: "0.75", value: "$28,350.25" },
            { asset: "ETH", amount: "5.2", value: "$10,218.68" },
            { asset: "SOL", amount: "50", value: "$4,000.00" }
          ]
        }, null, 2);

      case "execute_trade":
        if (!assetPair || !amount || !side) {
          return "Error: Asset pair, amount, and side (buy/sell) are required for trade execution";
        }
        // Simulate trade execution (would use actual API in production)
        const executionPrice = (Math.random() * 1000 + 20000).toFixed(2);
        return `Successfully ${side === "buy" ? "bought" : "sold"} ${amount} of ${assetPair.split('-')[0]} at $${executionPrice} per unit.`;

      case "get_market_data":
        if (!assetPair) {
          return "Error: Asset pair is required for market data (e.g., 'BTC-USD')";
        }
        // Simulate market data (would use actual API in production)
        return JSON.stringify({
          assetPair,
          price: "$" + (Math.random() * 10000 + 20000).toFixed(2),
          volume24h: "$" + (Math.random() * 1000000000 + 500000000).toFixed(2),
          change24h: (Math.random() * 10 - 5).toFixed(2) + "%",
          marketCap: "$" + (Math.random() * 1000000000000 + 100000000000).toFixed(2)
        }, null, 2);

      default:
        return `Error: Unknown operation '${operation}'. Supported operations are: check_price, get_portfolio, execute_trade, get_market_data`;
    }
  },
  {
    name: "coinbase_agentkit",
    description: "Interact with Coinbase for cryptocurrency operations",
    schema: z.object({
      operation: z.enum(["check_price", "get_portfolio", "execute_trade", "get_market_data"])
        .describe("The operation to perform: check_price, get_portfolio, execute_trade, or get_market_data"),
      assetPair: z.string().optional()
        .describe("The asset pair (e.g., 'BTC-USD') for price checks, trades, or market data"),
      amount: z.string().optional()
        .describe("The amount to trade (required for execute_trade operation)"),
      side: z.enum(["buy", "sell"]).optional()
        .describe("The trade side: buy or sell (required for execute_trade operation)")
    })
  }
);

// Export metadata separately
export const metadata = {
  category: ToolCategory.ONCHAIN,
  description: "Interact with Coinbase for cryptocurrency operations like checking prices, viewing portfolio, executing trades, and getting market data",
  usage: "coinbase_agentkit({ operation, assetPair, amount, side })",
  examples: [
    `coinbase_agentkit({ operation: 'check_price', assetPair: 'BTC-USD' })`,
    `coinbase_agentkit({ operation: 'get_portfolio' })`,
    `coinbase_agentkit({ operation: 'execute_trade', assetPair: 'ETH-USD', amount: '0.5', side: 'buy' })`,
    `coinbase_agentkit({ operation: 'get_market_data', assetPair: 'SOL-USD' })`
  ],
};