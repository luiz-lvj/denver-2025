import { tool } from "@langchain/core/tools";
import { z } from "zod";

/** Example tool: getWeather */
export const getWeather = tool(
  async (location: string) => {
    if (["sf", "san francisco"].includes(location.toLowerCase())) {
      return "It's 60 degrees and foggy in SF.";
    } else {
      return "It's 90 degrees and sunny.";
    }
  },
  {
    name: "get_weather",
    description: "Get the current weather for a location",
    schema: z.string().describe("The location to get weather for"),
  }
);
