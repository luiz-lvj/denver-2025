import { ToolRegistry } from "./ToolRegistry";

// Import all tools
import { getWeather, metadata as weatherMetadata } from "../tools/get-weather";
import { secretNumber, metadata as secretNumberMetadata } from "../tools/secret-number";
import { sumNumbers, metadata as sumNumbersMetadata } from "../tools/sum-numbers";
import { getTokenBalance, metadata as tokenBalanceMetadata } from "../tools/get-token-balance";
import { webSearch, metadata as webSearchMetadata } from "../tools/web-search";

// Create a singleton instance
export const toolRegistry = new ToolRegistry();

// Register all tools
toolRegistry.register("get_weather", getWeather, weatherMetadata);
toolRegistry.register("secret_number", secretNumber, secretNumberMetadata);
toolRegistry.register("sum_numbers", sumNumbers, sumNumbersMetadata);
toolRegistry.register("get_token_balance", getTokenBalance, tokenBalanceMetadata);
toolRegistry.register("web_search", webSearch, webSearchMetadata);

// Export types and registry
export * from "./types";
export * from "./ToolRegistry";

// Export tools array for convenience
export const tools = toolRegistry.getAllTools();
