// src/tools/webSearchTool.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolCategory } from "../../registry/types";

import dotenv from "dotenv";

dotenv.config();

export const webSearch = tool(
  async (query: string) => {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: `{"query":"${query}","topic":"general","search_depth":"basic","max_results":1,"time_range":null,"days":3,"include_answer":true,"include_raw_content":false,"include_images":false,"include_image_descriptions":false,"include_domains":[],"exclude_domains":[]}`,
    };

    const response = await fetch("https://api.tavily.com/search", options);
    const data = await response.json();

    return `Best result for query "${query}": ${data.answer}`;
  },
  {
    name: "web_search",
    description: "Search the web for the latest results based on a query",
    schema: z.string().describe("The search query"),
  }
);

// Export metadata separately
export const metadata = {
  category: ToolCategory.WEB,
  description: "Search the web for the latest results based on a given query",
  usage: "web_search(query: string)",
  examples: [
    "web_search('Who is the president of the United States?')",
    "web_search('latest news on AI development')",
    "web_search('ethereum price')"
  ],
};
