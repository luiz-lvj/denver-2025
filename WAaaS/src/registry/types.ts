import { Tool } from "@langchain/core/tools";
import { WaaaSToolWrapper } from "../tools/WaaaSToolWrapper";

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
  [key: string]: unknown; // Add index signature for compatibility
}

// Registry entry that combines the tool with its metadata
export interface RegistryEntry {
  tool: Tool | WaaaSToolWrapper<any>;
  metadata: ToolMetadata;
}
