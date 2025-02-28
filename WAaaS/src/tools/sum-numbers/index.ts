import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ToolCategory } from "../../registry/types";

// Implement the sum numbers tool
export const sumNumbers = tool(
  async (input: string) => {
    try {
      const [num1, num2] = input.split(',').map(n => parseFloat(n.trim()));
      if (isNaN(num1) || isNaN(num2)) {
        return "Error: Please provide two valid numbers separated by a comma.";
      }
      return `The sum of ${num1} and ${num2} is ${num1 + num2}.`;
    } catch (error) {
      return "Error: Please provide two numbers separated by a comma (e.g., '5,3').";
    }
  },
  {
    name: "sum_numbers",
    description: "Add two numbers together",
    schema: z.string().describe("Two numbers separated by a comma (e.g., '5,3')"),
  }
);

// Export metadata separately
export const metadata = {
  category: ToolCategory.CALCULATION,
  description: "Add two numbers together",
  usage: "sum_numbers(input: 'number1,number2')",
  examples: [
    "sum_numbers('5,3')", 
    "sum_numbers('10.5,20.3')",
    "sum_numbers('-10,5')"
  ],
}; 