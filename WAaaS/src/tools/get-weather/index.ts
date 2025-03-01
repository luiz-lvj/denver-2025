import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { weatherAction } from "./action";

// Create the weather tool with wrapper
export const getWeather = createWaaaSTool(weatherAction, {
  category: ToolCategory.INFORMATION,
  description: "Get the current weather for a location",
  usage: "get_weather({ location: 'city name' })",
  examples: [
    "get_weather({ location: 'San Francisco' })",
    "get_weather({ location: 'New York, NY' })",
    "get_weather({ location: 'Tokyo, Japan' })"
  ]
});

// Export metadata separately for compatibility with existing registry
export const metadata = {
  category: ToolCategory.INFORMATION,
  description: "Get the current weather for a location",
  usage: "get_weather({ location: 'city name' })",
  examples: [
    "get_weather({ location: 'San Francisco' })",
    "get_weather({ location: 'New York, NY' })",
    "get_weather({ location: 'Tokyo, Japan' })"
  ]
};
