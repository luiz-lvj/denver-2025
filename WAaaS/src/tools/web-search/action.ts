import { z } from "zod";
import { WaaaSAction } from "../types";
import dotenv from "dotenv";

dotenv.config();

// Define the schema for the web search tool
export const WebSearchSchema = z.object({
  query: z.string().describe("The search query to look up on the web")
}).strict();

// Create the implementation function
async function webSearchFunc(
  args: z.infer<typeof WebSearchSchema>
): Promise<string> {
  const { query } = args;
  
  // Check for API key
  if (!process.env.TAVILY_API_KEY) {
    return "Error: Tavily API key not configured. Please set TAVILY_API_KEY environment variable.";
  }
  
  try {
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
  } catch (error: any) {
    return `Error searching the web: ${error.message}`;
  }
}

// The web search tool description
const WEB_SEARCH_PROMPT = `
This tool searches the web for the latest information based on a query.

Required inputs:
- query: The search term to look up on the web

Important notes:
- Requires a Tavily API key to be set as TAVILY_API_KEY in the environment
- Searches for up-to-date information from the web
- Returns the best match for the query
`;

// Export the web search action
export const webSearchAction: WaaaSAction<typeof WebSearchSchema> = {
  name: "web_search",
  description: WEB_SEARCH_PROMPT,
  schema: WebSearchSchema,
  func: webSearchFunc
}; 