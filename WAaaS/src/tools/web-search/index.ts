// src/tools/webSearchTool.ts
import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { webSearchAction } from "./action";

import dotenv from "dotenv";

dotenv.config();

// Create the web search tool
export const webSearch = createWaaaSTool(webSearchAction, {
  category: ToolCategory.UTILITY,
  description: "Search the web for real-time information about any topic",
  usage: `web_search({ query: "your search query here" })`,
  examples: [
    `web_search({ query: "current weather in New York City" })`,
    `web_search({ query: "latest developments in quantum computing" })`,
    `web_search({ query: "ethereum price today" })`
  ]
});

// Export metadata separately for compatibility with the existing registry
export const metadata = {
  category: ToolCategory.UTILITY,
  description: "Search the web for real-time information about any topic",
  usage: `web_search({ query: "your search query here" })`,
  examples: [
    `web_search({ query: "current weather in New York City" })`,
    `web_search({ query: "latest developments in quantum computing" })`,
    `web_search({ query: "ethereum price today" })`
  ]
};
