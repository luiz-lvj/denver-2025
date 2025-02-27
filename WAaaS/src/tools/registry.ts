import { Tool } from "@langchain/core/tools";
import { getWeather } from "./get-weather";
import { secretNumber } from "./secret-number";
import { sumNumbers } from "./sum-numbers";
import { getTokenBalance } from "./get-token-balance";
import { webSearch } from "./web-search";

// Define tool categories
export enum ToolCategory {
  UTILITY = "utility",
  INFORMATION = "information",
  CALCULATION = "calculation",
  ONCHAIN = "onchain",
  WEB = "web",
}

// Tool metadata interface
export interface ToolMetadata {
  category: ToolCategory;
  description: string;
  usage: string;
  examples: string[];
}

// Registry entry that combines the tool with its metadata
export interface RegistryEntry {
  tool: Tool;
  metadata: ToolMetadata;
}

// Main registry type
export interface Registry {
  [key: string]: RegistryEntry;
}

// Tool registry with metadata
export const registry: Registry = {
  get_weather: {
    tool: getWeather,
    metadata: {
      category: ToolCategory.INFORMATION,
      description: "Get the current weather for a location",
      usage: "get_weather(location: string)",
      examples: ["get_weather('San Francisco')", "get_weather('New York')"]
    }
  },
  secret_number: {
    tool: secretNumber,
    metadata: {
      category: ToolCategory.UTILITY,
      description: "Returns the secret number",
      usage: "secret_number()",
      examples: ["secret_number()"]
    }
  },
  sum_numbers: {
    tool: sumNumbers,
    metadata: {
      category: ToolCategory.CALCULATION,
      description: "Add two numbers together",
      usage: "sum_numbers(input: 'number1,number2')",
      examples: ["sum_numbers('5,3')", "sum_numbers('10.5,20.3')"]
    }
  },
  get_token_balance: {
    tool: getTokenBalance,
    metadata: {
      category: ToolCategory.ONCHAIN,
      description: "Retrieve token balance for an address on a specific blockchain",
      usage: "get_token_balance(input: string)",
      examples: [
        "get_token_balance('0x6B175474E89094C44Da98b954EedeAC495271d0F', '0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8', 'ethereum', 'mainnet')",
        "get_token_balance('0xUSDC_CONTRACT', '0xUSER_WALLET', 'base', 'mainnet')",
      ],
    }
  },
  web_search: {
    tool: webSearch,
    metadata: {
      category: ToolCategory.WEB,
      description: "Search the web for the latest results based on a given query",
      usage: "web_search(query: string)",
      examples: ["web_search('Who is the president of the United States?')"]
    }
  }
};

// Helper functions
export const tools: Tool[] = Object.values(registry).map(entry => entry.tool);

export function getToolByName(name: string): Tool | undefined {
  return registry[name]?.tool;
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return Object.values(registry)
    .filter(entry => entry.metadata.category === category)
    .map(entry => entry.tool);
}

export function getToolMetadata(name: string): ToolMetadata | undefined {
  return registry[name]?.metadata;
}

export function getToolDescription(includeExamples: boolean = false): string {
  let description = "Available Tools:\n\n";
  
  Object.entries(registry).forEach(([name, entry]) => {
    description += `${name}: ${entry.metadata.description}\n`;
    description += `  Usage: ${entry.metadata.usage}\n`;
    
    if (includeExamples) {
      description += "  Examples:\n";
      entry.metadata.examples.forEach(example => {
        description += `    - ${example}\n`;
      });
    }
    description += "\n";
  });
  
  return description;
}

// Simple registration function for new tools
export function registerTool(
  name: string, 
  tool: Tool, 
  metadata: ToolMetadata
): void {
  registry[name] = { tool, metadata };
} 