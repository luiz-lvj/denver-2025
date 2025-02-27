// import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

import { tools } from "../tools";
import dotenv from "dotenv";
import { getToolDescription } from "../tools/registry";

dotenv.config();

// Configuration type for the agent
interface AgentConfig {
  configurable: {
    thread_id: string;
  };
}

/**
 * Creates and configures a React agent with tools and memory
 */
export async function createAgent() {
  validateEnvironment();

  // Initialize the LLM
  const llm = new ChatOpenAI({
    model: "gpt-4",  // or gpt-4o-mini if you have access
    temperature: 0.2,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Store conversation history in memory
  const memory = new MemorySaver();
  
  // Create agent configuration
  const agentConfig: AgentConfig = {
    configurable: {
      thread_id: "simple-agent-chat",
    }
  };

  // Create the React agent
  const agent = await createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: getSystemPrompt(),
  });

  return { agent, config: agentConfig };
}

/**
 * Get the system prompt for the agent with detailed tool information
 */
function getSystemPrompt(): string {
  return `You are a helpful AI assistant with access to several useful tools.

${getToolDescription(true)}

Instructions:
- Use tools appropriately based on user requests
- For weather queries, use get_weather
- For addition, use sum_numbers
- For web search, use web_search
- For token balance queries, use get_token_balance
  - Extract the necessary parameters from natural language: tokenAddress, holderAddress, chain, network
  - For DAI token on Ethereum mainnet, use address 0x6B175474E89094C44Da98b954EedeAC495271d0F
  - Common examples:
    - "Check my DAI balance on Ethereum mainnet" → Use ethereum, mainnet, DAI address, and ask for wallet
    - "What's my token balance for X on Y chain" → Ask for specific token address if not provided
- Be concise and helpful in your responses
- If a tool fails, explain the issue and suggest correct format
- Maintain conversation context using previous messages

Remember to think step-by-step about which tool to use for each request.`;
}

/**
 * Validates required environment variables
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = ["OPENAI_API_KEY"];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }
}

/**
 * Creates a GPT-4 React agent executor.
 *
 * @param sessionId - Unique ID for the conversation session.
 * @returns A compiled agent that can be invoked with chat messages.
 */
export async function createAgentExecutor(sessionId: string) {
  validateEnvironment();

  // Initialize the LLM
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.2,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Store conversation history in memory
  const memory = new MemorySaver();

  // Define the system prompt
  const systemPrompt = 
    "You are a helpful AI assistant with access to several useful tools:\n\n" +
    "1. get_weather: Check current weather conditions for any location\n" +
    "2. secret_number: Reveal the secret number (it's always 42)\n" +
    "3. sum_numbers: Add two numbers together (input format: 'number1,number2')\n\n" +
    "4. web_search: Search the web for the latest results based on a given query\n\n" +
    "5. get_token_balance: Retrieve a token balance for an address on a specific blockchain network\n\n" +
    "When a user's request can be helped by these tools, use them appropriately. " +
    "For weather queries, use the get_weather tool. For addition, use sum_numbers. " +
    "For web search, use web_search. " +
    "For token balance queries, use get_token_balance. " +
    "Be concise and helpful with your responses.\n\n";

  // const prompt = new PromptTemplate({
  //   template: systemPrompt,
  //   inputVariables: ["tools", "tool_names", "agent_scratchpad"],
  // });

  // Create the React agent
  const agent = await createReactAgent({
    llm,
    tools,
    // prompt,
    messageModifier: systemPrompt,
    checkpointSaver: memory,
  });

  return agent;

  // Wrap the agent in an executor
  // const agentExecutor = new AgentExecutor({
  //   agent,
  //   tools,
  // });

  // return agentExecutor;
}
