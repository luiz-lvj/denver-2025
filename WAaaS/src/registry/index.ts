import { ToolRegistry } from "./ToolRegistry";

// Import all tools
import { getWeather, metadata as weatherMetadata } from "../tools/get-weather";
import { secretNumber, metadata as secretNumberMetadata } from "../tools/secret-number";
import { sumNumbers, metadata as sumNumbersMetadata } from "../tools/sum-numbers";
import { getTokenBalance, metadata as tokenBalanceMetadata } from "../tools/get-token-balance";
import { webSearch, metadata as webSearchMetadata } from "../tools/web-search";
import { githubPr, metadata as githubPrMetadata } from "../tools/github-pr";
import { coinbaseAgentkit, metadata as coinbaseAgentkitMetadata } from "../tools/coinbase-agentkit";
import { transfer, metadata as transferMetadata } from "../tools/transfer";

// Create a singleton instance
export const toolRegistry = new ToolRegistry();

// Register all tools
toolRegistry.register("get_weather", getWeather, weatherMetadata);
toolRegistry.register("secret_number", secretNumber, secretNumberMetadata);
toolRegistry.register("sum_numbers", sumNumbers, sumNumbersMetadata);
toolRegistry.register("get_token_balance", getTokenBalance, tokenBalanceMetadata);
toolRegistry.register("web_search", webSearch, webSearchMetadata);
toolRegistry.register("github_pr", githubPr, githubPrMetadata);
toolRegistry.register("coinbase_agentkit", coinbaseAgentkit, coinbaseAgentkitMetadata);
toolRegistry.register("transfer", transfer, transferMetadata);

// Export types and registry
export * from "./types";
export * from "./ToolRegistry";

// Export tools array for convenience
export const tools = toolRegistry.getAllTools();
