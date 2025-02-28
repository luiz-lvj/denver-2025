// src/routes/chat.ts
import { Router } from "express";
import { createAgentExecutor } from "../agent/agent";
import { HumanMessage } from "@langchain/core/messages";
import { processMessage } from "../agent/chat";

const router = Router();

// In-memory map to hold session agents
const sessionAgents = new Map<string, any>();
const sessionConfigs = new Map<string, any>();

router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: "Missing message or sessionId" });
    }

    // Retrieve or create an agent for the session
    let agent = sessionAgents.get(sessionId);
    let config = sessionConfigs.get(sessionId);
    
    if (!agent) {
      // Create a new agent and store both agent and config
      const result = await createAgentExecutor(sessionId);
      
      // If createAgentExecutor returns an object with agent and config
      if (result && result.config) {
        agent = result;
        config = result.config;
        sessionAgents.set(sessionId, agent);
        sessionConfigs.set(sessionId, config);
      } else {
        // If it just returns the agent directly
        agent = result;
        config = { configurable: { thread_id: sessionId } };
        sessionAgents.set(sessionId, agent);
        sessionConfigs.set(sessionId, config);
      }
    }

    // Process the message using the agent
    const response = await processMessage(agent, config, message);
    
    // Return the processed response
    res.json({ 
      response: response.content,
      lastAiMessage: response.content // Added for compatibility with client
    });
  } catch (error: any) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;