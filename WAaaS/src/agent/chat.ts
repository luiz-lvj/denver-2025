import { HumanMessage } from "@langchain/core/messages";

export interface ChatResponse {
  content: string;
  error?: string;
}

/**
 * Process a chat message through the agent
 */
export async function processMessage(agent: any, config: any, message: string): Promise<ChatResponse> {
  try {
    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] }, 
      config
    );

    // Track which chunks we've already seen to avoid duplicates
    const seen = new Set<string>();
    let response = '';
    
    for await (const chunk of stream) {
      let content = '';
      
      if ("agent" in chunk && chunk.agent.messages.length > 0) {
        content = chunk.agent.messages[0].content;
      } else if ("tools" in chunk && chunk.tools.messages.length > 0) {
        content = chunk.tools.messages[0].content;
      }
      
      // Only add content if we haven't seen it before
      if (content && !seen.has(content)) {
        seen.add(content);
        response += content + '\n';
      }
    }

    return { content: response.trim() };
  } catch (error: any) {
    return { 
      content: "An error occurred while processing your message",
      error: error.message 
    };
  }
} 