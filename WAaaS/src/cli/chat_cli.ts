// src/cli/chat_cli.ts
import readline from "readline";
import { createAgent } from "../agent/agent";
import { processMessage } from "../agent/chat";

async function startChat() {
  console.log("Initializing agent...");
  const { agent, config } = await createAgent();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "You: "
  });

  console.log("\nWelcome to the AI Assistant Chat!");
  console.log("Type your message and press Enter (type 'exit' to quit).");
  rl.prompt();

  rl.on("line", async (line) => {
    const message = line.trim();
    if (message.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      const response = await processMessage(agent, config, message);
      if (response.error) {
        console.error("Error:", response.error);
      } else {
        console.log("AI:", response.content);
      }
    } catch (error: any) {
      console.error("System Error:", error.message);
    }
    rl.prompt();
  }).on("close", () => {
    console.log("\nGoodbye!");
    process.exit(0);
  });
}

if (require.main === module) {
  startChat().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}