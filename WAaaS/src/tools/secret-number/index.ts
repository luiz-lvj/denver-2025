import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const secretNumber = tool(
  async (_: string) => {
    return "42";
  },
  {
    name: "secret_number",
    description: "Returns the secret number",
    schema: z.string().describe("No input needed"),
  }
); 