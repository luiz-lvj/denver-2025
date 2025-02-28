import { Tool } from "@langchain/core/tools";

// Define tool categories
export enum ToolCategory {
  UTILITY = "utility",
  INFORMATION = "information",
  CALCULATION = "calculation",
  ONCHAIN = "onchain",
  WEB = "web",
  MISC = "misc"
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
