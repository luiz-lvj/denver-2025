// src/registry/ToolRegistry.ts

import { Tool } from "@langchain/core/tools";
import { ToolCategory, RegistryEntry, ToolMetadata } from "./types";

export class ToolRegistry {
  private registry = new Map<string, RegistryEntry>();

  // Register a new tool
  register(name: string, tool: Tool, metadata: ToolMetadata): void {
    this.registry.set(name, { tool, metadata });
  }

  // Get a tool by name
  getTool(name: string): Tool | undefined {
    return this.registry.get(name)?.tool;
  }

  // Get all tools as an array
  getAllTools(): Tool[] {
    return Array.from(this.registry.values()).map(entry => entry.tool);
  }

  // Get metadata for a tool
  getMetadata(name: string): ToolMetadata | undefined {
    return this.registry.get(name)?.metadata;
  }

  // Get tools by category
  getToolsByCategory(category: ToolCategory): Tool[] {
    return Array.from(this.registry.values())
      .filter(entry => entry.metadata.category === category)
      .map(entry => entry.tool);
  }

  // Generate a descriptive list of all tools
  listTools(includeExamples = false): string {
    let description = "Available Tools:\n\n";
    
    this.registry.forEach((entry, name) => {
      description += `${name}: ${entry.metadata.description}\n`;
      description += `  Usage: ${entry.metadata.usage}\n`;
      
      if (includeExamples && entry.metadata.examples.length > 0) {
        description += "  Examples:\n";
        entry.metadata.examples.forEach(example => {
          description += `    - ${example}\n`;
        });
      }
      description += "\n";
    });
    
    return description;
  }
}