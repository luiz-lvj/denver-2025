import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { coinbaseAgentKitAction } from "./action";

// Create the tool with wrapper
export const coinbaseAgentkit = createWaaaSTool(coinbaseAgentKitAction, {
  category: ToolCategory.ONCHAIN,
  description: "Interact with Coinbase for cryptocurrency operations like checking prices, viewing portfolio, executing trades, and getting market data",
  usage: "coinbase_agentkit({ operation, assetPair, amount, side })",
  examples: [
    `coinbase_agentkit({ operation: 'check_price', assetPair: 'BTC-USD' })`,
    `coinbase_agentkit({ operation: 'get_portfolio' })`,
    `coinbase_agentkit({ operation: 'execute_trade', assetPair: 'ETH-USD', amount: '0.5', side: 'buy' })`,
    `coinbase_agentkit({ operation: 'get_market_data', assetPair: 'SOL-USD' })`
  ]
});

// Export metadata separately for compatibility with existing registry
export const metadata = {
  category: ToolCategory.ONCHAIN,
  description: "Interact with Coinbase for cryptocurrency operations like checking prices, viewing portfolio, executing trades, and getting market data",
  usage: "coinbase_agentkit({ operation, assetPair, amount, side })",
  examples: [
    `coinbase_agentkit({ operation: 'check_price', assetPair: 'BTC-USD' })`,
    `coinbase_agentkit({ operation: 'get_portfolio' })`,
    `coinbase_agentkit({ operation: 'execute_trade', assetPair: 'ETH-USD', amount: '0.5', side: 'buy' })`,
    `coinbase_agentkit({ operation: 'get_market_data', assetPair: 'SOL-USD' })`
  ]
};