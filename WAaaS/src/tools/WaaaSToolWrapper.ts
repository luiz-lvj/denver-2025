import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { WaaaSAction, WaaaSActionSchema } from "./types";
import { ToolCategory } from "../registry/types";

/**
 * Metadata for WAaaS tools
 */
export interface WaaaSToolMetadata {
  category: ToolCategory;
  description: string;
  usage: string;
  examples: string[];
  [key: string]: unknown; // Add index signature for compatibility
}

/**
 * A tool class that wraps a WAaaS action for use with LangChain
 */
export class WaaaSToolWrapper<TActionSchema extends WaaaSActionSchema> extends StructuredTool {
  public schema: TActionSchema;
  public name: string;
  public description: string;
  private action: WaaaSAction<TActionSchema>;
  public metadata: Record<string, unknown>; // Change type to match base class
  private waaasMetadata: WaaaSToolMetadata;

  /**
   * Constructor for the WAaaS Tool wrapper class
   *
   * @param action - The WAaaS action to execute
   * @param metadata - Metadata for the tool
   */
  constructor(action: WaaaSAction<TActionSchema>, metadata: WaaaSToolMetadata) {
    super();
    this.action = action;
    this.name = action.name;
    this.description = action.description;
    this.schema = action.schema;
    this.waaasMetadata = metadata;
    
    // Create standard metadata format for compatibility
    this.metadata = {
      ...metadata,
      category: metadata.category,
      description: metadata.description,
      usage: metadata.usage,
      examples: metadata.examples
    };
  }

  /**
   * Get the WAaaS-specific metadata
   */
  public getWaaaSMetadata(): WaaaSToolMetadata {
    return this.waaasMetadata;
  }

  /**
   * Executes the WAaaS action with the provided input
   *
   * @param input - An object containing schema-validated arguments
   * @returns A promise that resolves to the result of the WAaaS action
   */
  protected async _call(
    input: z.infer<typeof this.schema> & Record<string, unknown>,
  ): Promise<string> {
    try {
      // If we have a schema, validate against it
      if (this.schema) {
        try {
          const validatedInput = this.schema.parse(input);
          return await this.action.func(validatedInput);
        } catch (validationError) {
          if (validationError instanceof Error) {
            return `Validation error in ${this.name}: ${validationError.message}`;
          }
          return `Validation error in ${this.name}: Unknown error occurred`;
        }
      }
      
      // Fallback if no schema
      return await this.action.func(input as any);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return `Error executing ${this.name}: ${error.message}`;
      }
      return `Error executing ${this.name}: Unknown error occurred`;
    }
  }
}

/**
 * Create a WAaaS tool from an action and metadata
 * 
 * @param action The WAaaS action to wrap
 * @param metadata Metadata for the tool
 * @returns A LangChain compatible tool
 */
export function createWaaaSTool<TSchema extends WaaaSActionSchema>(
  action: WaaaSAction<TSchema>,
  metadata: WaaaSToolMetadata
): WaaaSToolWrapper<TSchema> {
  return new WaaaSToolWrapper(action, metadata);
} 