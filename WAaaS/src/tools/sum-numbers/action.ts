import { z } from "zod";
import { WaaaSAction } from "../types";

// Define the schema for the sum numbers tool
export const SumNumbersSchema = z.object({
  num1: z.number().describe("The first number to add"),
  num2: z.number().describe("The second number to add")
}).strict();

// Create the implementation function
async function sumNumbersFunc(
  args: z.infer<typeof SumNumbersSchema>
): Promise<string> {
  const { num1, num2 } = args;
  return `The sum of ${num1} and ${num2} is ${num1 + num2}.`;
}

// The sum numbers tool description
const SUM_NUMBERS_PROMPT = `
This tool adds two numbers together.

Required inputs:
- num1: The first number to add
- num2: The second number to add

Important notes:
- Both inputs must be valid numbers
- Returns a string with the result of the addition
`;

// Export the sum numbers action
export const sumNumbersAction: WaaaSAction<typeof SumNumbersSchema> = {
  name: "sum_numbers",
  description: SUM_NUMBERS_PROMPT,
  schema: SumNumbersSchema,
  func: sumNumbersFunc
}; 