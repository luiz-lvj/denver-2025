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

    let response = '';
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        response += chunk.agent.messages[0].content + '\n';
      } else if ("tools" in chunk) {
        response += chunk.tools.messages[0].content + '\n';
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