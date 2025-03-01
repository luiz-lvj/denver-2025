import { z } from "zod";
import { WaaaSAction } from "../types";

// Define the schema for the weather tool
export const WeatherSchema = z.object({
  location: z.string().describe("The city and optionally state/country")
}).strict();

// Create the implementation function
async function getWeatherFunc(
  args: z.infer<typeof WeatherSchema>
): Promise<string> {
  const { location } = args;
  
  // This would normally call a weather API
  return `The weather in ${location} is currently sunny with a temperature of 72°F.`;
}

// The weather tool description
const WEATHER_PROMPT = `
This tool retrieves current weather information for a specified location.

Required inputs:
- location: The city name and optionally state/country (e.g., "San Francisco" or "New York, NY")

Important notes:
- Returns a simple weather description and temperature
- This is a simulated response for demonstration purposes
`;

// Export the weather action
export const weatherAction: WaaaSAction<typeof WeatherSchema> = {
  name: "get_weather",
  description: WEATHER_PROMPT,
  schema: WeatherSchema,
  func: getWeatherFunc
}; 