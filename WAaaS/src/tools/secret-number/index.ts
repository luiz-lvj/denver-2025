import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolCategory } from "../../registry/types";

// Implement the secret number tool
export const secretNumber = tool(
  async () => {
    return "The secret number is 42.";
  },
  {
    name: "secret_number",
    description: "Reveals the secret number",
    schema: z.string().describe("No input required"),
  }
);

// Export metadata separately
export const metadata = {
  category: ToolCategory.MISC,
  description: "Returns the secret number",
  usage: "secret_number()",
  examples: ["secret_number()"],
}; 