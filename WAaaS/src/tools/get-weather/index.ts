import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolCategory } from "../../registry/types";

/** Example tool: getWeather */
export const getWeather = tool(
  async (location: string) => {
    // This would normally call a weather API
    return `The weather in ${location} is currently sunny with a temperature of 72°F.`;
  },
  {
    name: "get_weather",
    description: "Get the current weather for a location",
    schema: z.string().describe("The city and optionally state/country"),
  }
);

// Export metadata separately
export const metadata = {
  category: ToolCategory.INFORMATION,
  description: "Get the current weather for a location",
  usage: "get_weather(location: string)",
  examples: [
    "get_weather('San Francisco')", 
    "get_weather('New York, NY')",
    "get_weather('Tokyo, Japan')"
  ],
};
