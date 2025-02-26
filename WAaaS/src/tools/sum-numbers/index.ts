import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const sumNumbers = tool(
  async (input: string) => {
    const numbers = input.split(',').map(n => parseFloat(n.trim()));
    if (numbers.length !== 2 || numbers.some(n => isNaN(n))) {
      return "Please provide two valid numbers separated by a comma";
    }
    return (numbers[0] + numbers[1]).toString();
  },
  {
    name: "sum_numbers",
    description: "Add two numbers together. Input should be two numbers separated by a comma (e.g. '5,3')",
    schema: z.string().describe("Two numbers separated by a comma"),
  }
); 