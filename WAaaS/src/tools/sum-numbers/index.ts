import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { sumNumbersAction } from "./action";

// Create the sum numbers tool with wrapper
export const sumNumbers = createWaaaSTool(sumNumbersAction, {
  category: ToolCategory.CALCULATION,
  description: "Add two numbers together",
  usage: "sum_numbers({ num1: number, num2: number })",
  examples: [
    "sum_numbers({ num1: 5, num2: 3 })",
    "sum_numbers({ num1: 10.5, num2: 20.3 })",
    "sum_numbers({ num1: -10, num2: 5 })"
  ]
});

// Export metadata separately for compatibility with existing registry
export const metadata = {
  category: ToolCategory.CALCULATION,
  description: "Add two numbers together",
  usage: "sum_numbers({ num1: number, num2: number })",
  examples: [
    "sum_numbers({ num1: 5, num2: 3 })",
    "sum_numbers({ num1: 10.5, num2: 20.3 })",
    "sum_numbers({ num1: -10, num2: 5 })"
  ]
}; 