import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tools, toolRegistry } from "../registry";
import dotenv from "dotenv";

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
      thread_id: "ai-agent-v0",
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

${toolRegistry.listTools(true)}

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
- For creating GitHub pull requests, use github_pr
  - You'll need details like title, description, branch names, repository, file path, and content
  - This is particularly useful for adding new tool implementations
- For cryptocurrency operations, use coinbase_agentkit
  - You can check prices with operation: 'check_price', get portfolio data with operation: 'get_portfolio'
  - Execute trades with operation: 'execute_trade' or get market data with operation: 'get_market_data'
- For token transfers between chains, use transfer
  - You'll need the source chain, destination address, amount, and optionally token type and data
  - Supports Ethereum, Base, Mode, Arbitrum, and Optimism networks
  - Example: "Transfer 0.1 ETH from Ethereum to address 0x123..."
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
  const requiredVars = ["OPENAI_API_KEY", "TAVILY_API_KEY"];
  
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

  // Create the React agent with system prompt
  const systemPrompt = 
    "You are a helpful AI assistant with access to several useful tools:\n\n" +
    toolRegistry.listTools(false) +
    "When a user's request can be helped by these tools, use them appropriately. " +
    "For weather queries, use the get_weather tool. For addition, use sum_numbers. " +
    "For web search, use web_search. " +
    "For token balance queries, use get_token_balance. " +
    "For GitHub pull requests, use github_pr. " +
    "For cryptocurrency operations, use coinbase_agentkit. " +
    "For token transfers, use transfer. " +
    "Be concise and helpful with your responses.\n\n";

  // Create the React agent
  const agent = await createReactAgent({
    llm,
    tools,
    messageModifier: systemPrompt,
    checkpointSaver: memory,
  });

  return agent;
}
