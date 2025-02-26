// src/routes/chat.ts
import { Router } from "express";
import { createAgentExecutor } from "../agent/agent";

const router = Router();

// In-memory map to hold session executors.
// In production, you may wish to persist this in a database or use proper session middleware.
const sessionAgents: Map<string, any> = new Map();

router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: "Missing message or sessionId" });
    }

    // Retrieve or create an executor for the session.
    let executor = sessionAgents.get(sessionId);
    if (!executor) {
      executor = await createAgentExecutor(sessionId);
      sessionAgents.set(sessionId, executor);
    }

    // Call the agent with the user message.
    const result = await executor.call({ input: message });
    // Return the agent's final output.
    res.json({ response: result.output || result.text });
  } catch (error: any) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;