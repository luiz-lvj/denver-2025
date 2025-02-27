// src/tools/webSearchTool.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
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
    description: "Search the web for the latest results based on a given query",
    // Validates that the tool is called with a string (the query).
    schema: z.string().describe("The search query string"),
  }
);
