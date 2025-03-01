import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { secretNumberAction } from "./action";

// Create the secret number tool with wrapper
export const secretNumber = createWaaaSTool(secretNumberAction, {
  category: ToolCategory.MISC,
  description: "Returns the secret number",
  usage: "secret_number({})",
  examples: [
    "secret_number({})"
  ]
});

// Export metadata separately for compatibility with existing registry
export const metadata = {
  category: ToolCategory.MISC,
  description: "Returns the secret number",
  usage: "secret_number({})",
  examples: [
    "secret_number({})"
  ]
}; 