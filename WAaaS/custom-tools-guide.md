# Custom Tools Guide for WAaaS

This guide demonstrates how to create and use custom tools with the WAaaS platform using the WaaaSAction system.

## Overview

The WAaaS custom tool system provides a structured way to create type-safe tools that integrate with LangChain's agent framework. The system consists of several key components:

1. `WaaaSAction` - The core interface for defining actions
2. `WaaaSToolWrapper` - A wrapper that converts actions to LangChain-compatible tools
3. `createWaaaSTool` - A helper function to simplify tool creation

## Creating a Custom Tool

Creating a custom tool is a three-step process:

### 1. Define Your Schema

First, define a schema using Zod that describes the parameters your tool accepts:

```typescript
import { z } from "zod";

const MyToolSchema = z.object({
  parameter1: z.string().describe("Description of parameter 1"),
  parameter2: z.number().describe("Description of parameter 2"),
  optionalParam: z.boolean().optional().describe("Optional parameter")
}).strict();
```

### 2. Implement the Action Logic

Next, implement your action as a function that accepts the parameters defined in your schema:

```typescript
async function myToolFunction(
  args: z.infer<typeof MyToolSchema>
): Promise<string> {
  const { parameter1, parameter2, optionalParam } = args;
  
  // Implement your tool's logic here
  // ...
  
  // Return a string result
  return JSON.stringify({
    result: "Success",
    data: {
      // Your response data
    }
  }, null, 2);
}
```

### 3. Create and Export the WaaaSAction

Define your action by implementing the `WaaaSAction` interface:

```typescript
import { WaaaSAction } from "../types";

export const myToolAction: WaaaSAction<typeof MyToolSchema> = {
  name: "my_tool",
  description: "Description of what my tool does",
  schema: MyToolSchema,
  func: myToolFunction
};
```

### 4. Create the Tool Instance

In your tool's `index.ts` file, create and export the tool and its metadata:

```typescript
import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { myToolAction } from "./action";

// Create the tool with wrapper
export const myTool = createWaaaSTool(myToolAction, {
  category: ToolCategory.UTILITY,
  description: "Human-friendly description of the tool",
  usage: "my_tool({ parameter1, parameter2, optionalParam? })",
  examples: [
    `my_tool({ parameter1: 'value1', parameter2: 42 })`,
    `my_tool({ parameter1: 'another value', parameter2: 100, optionalParam: true })`
  ]
});

// Export metadata separately for registry compatibility
export const metadata = {
  category: ToolCategory.UTILITY,
  description: "Human-friendly description of the tool",
  usage: "my_tool({ parameter1, parameter2, optionalParam? })",
  examples: [
    `my_tool({ parameter1: 'value1', parameter2: 42 })`,
    `my_tool({ parameter1: 'another value', parameter2: 100, optionalParam: true })`
  ]
};
```

### 5. Register the Tool

Finally, register your tool in `WAaaS/src/registry/index.ts`:

```typescript
import { myTool, metadata as myToolMetadata } from "../tools/my-tool";

// Register all tools
// ...existing tools...
toolRegistry.register("my_tool", myTool, myToolMetadata);
```

## Benefits of the Custom Tool System

- **Type Safety**: Zod schemas provide runtime type validation
- **Structured Parameters**: Clear definition of required vs. optional parameters
- **Consistent Documentation**: Structured way to document parameters and usage
- **Validation**: Built-in parameter validation with helpful error messages
- **Testability**: Easy to test actions independently of LangChain

## Example: Transfer Tool

Here's a complete example of the Transfer tool implementation:

### action.ts
```typescript
import { z } from "zod";
import { WaaaSAction } from "../types";

// Schema for transfer parameters
export const TransferSchema = z.object({
  fromChain: z
    .enum(["ethereum", "base", "mode"])
    .describe("Chain to transfer from"),
  toAddress: z
    .string()
    .describe("Destination wallet address"),
  amount: z
    .string()
    .describe("Amount to transfer in native token units"),
  token: z
    .string()
    .optional()
    .describe("Token to transfer (defaults to native token)")
}).strict();

async function transferFunc(
  args: z.infer<typeof TransferSchema>
): Promise<string> {
  // Implementation...
  return JSON.stringify({
    success: true,
    transaction: {
      // Transaction details...
    }
  }, null, 2);
}

export const transferAction: WaaaSAction<typeof TransferSchema> = {
  name: "transfer",
  description: "Transfer tokens between addresses",
  schema: TransferSchema,
  func: transferFunc
};
```

### index.ts
```typescript
import { ToolCategory } from "../../registry/types";
import { createWaaaSTool } from "../WaaaSToolWrapper";
import { transferAction } from "./action";

export const transfer = createWaaaSTool(transferAction, {
  category: ToolCategory.ONCHAIN,
  description: "Transfer tokens between addresses",
  usage: "transfer({ fromChain, toAddress, amount, token? })",
  examples: [
    `transfer({ fromChain: 'ethereum', toAddress: '0x1234...', amount: '0.1' })`
  ]
});

export const metadata = {
  category: ToolCategory.ONCHAIN,
  description: "Transfer tokens between addresses",
  usage: "transfer({ fromChain, toAddress, amount, token? })",
  examples: [
    `transfer({ fromChain: 'ethereum', toAddress: '0x1234...', amount: '0.1' })`
  ]
};
``` 