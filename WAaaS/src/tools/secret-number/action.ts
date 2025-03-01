import { z } from "zod";
import { WaaaSAction } from "../types";

// Define an empty schema for the secret number tool
export const SecretNumberSchema = z.object({}).strict();

// Create the implementation function
async function secretNumberFunc(
  _args: z.infer<typeof SecretNumberSchema>
): Promise<string> {
  return "The secret number is 42.";
}

// The secret number tool description
const SECRET_NUMBER_PROMPT = `
This tool reveals the secret number.

Required inputs:
- None (this tool doesn't take any parameters)

Important notes:
- Simply returns the secret number without any computation
`;

// Export the secret number action
export const secretNumberAction: WaaaSAction<typeof SecretNumberSchema> = {
  name: "secret_number",
  description: SECRET_NUMBER_PROMPT,
  schema: SecretNumberSchema,
  func: secretNumberFunc
}; 