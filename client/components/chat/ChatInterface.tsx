"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message, MessageActions } from "@/types/chat";

export function ChatInterface() {

  // ───────────────────────────────────────────────────────────
  // Existing chat states
  // ───────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `**Hello!** I’m your specialized assistant, ready to help with a range of tasks:
  
      - **General Questions**  
        Ask me anything—from coding advice to trivia, I can offer insights and explanations.
      
      - **Token Transfers**  
        Want to send tokens to someone? Just let me know the address, token type, and amount.
      
      - **Token Swaps**  
        Need to swap one token for another (e.g., ETH to USDC)? I can set that up for you, too.
      
      - **Faucet Requests**  
        If you need test tokens from a faucet, I can help you request the right amount and confirm the transaction.
      
      - **Sentiment Analysis**  
        Curious how optimistic or pessimistic your idea might seem? I can gauge the sentiment on a scale from very negative to very positive.
      
      - **Suggestions & Confirmations**  
        I’m also able to suggest follow-up actions or confirm next steps—just let me know what you’d like to do.
      
      What can I assist you with today?`
    },
  ]);

  const [messageActions, setMessageActions] = useState<
    Record<string, MessageActions>
  >({
    "1": { messageId: "1", actions: [] },
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (userInput?: string) => {
    const finalInput = userInput || input;
    if (!finalInput.trim() || isLoading) return;


    const userMessage: Message = {
      id: Date.now().toString(),
      content: finalInput,
      role: "user",
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setErrors({});

    try {
      // mock response
      const data = {
        lastAiMessage: "Hello! How can I assist you today?",
      };

      // Create a new AI message from the server’s response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.lastAiMessage ?? "[No AI message found]",
        role: "assistant",
      };
      setMessages((prev) => [...prev, aiMessage]);

      // ─────────────────────────────────────────────────────────
      // 4. Parse the AI message with /api/parse
      // ─────────────────────────────────────────────────────────
      try {
        const parseResponse = await fetch("/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: aiMessage.content,
            messageId: aiMessage.id,
          }),
        });

        if (!parseResponse.ok) {
          throw new Error("Failed to parse message");
        }

        const parsedData = await parseResponse.json();
        console.log("Parsed Data:", parsedData);

        // Update the AI message with parsed data
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id ? { ...msg, parsedData } : msg
          )
        );

        // If the parsed response has actions, store them
        if (parsedData.actions?.length > 0) {
          setMessageActions((prev) => ({
            ...prev,
            [aiMessage.id]: {
              messageId: aiMessage.id,
              actions: parsedData.actions,
            },
          }));
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
        setErrors((prev) => ({
          ...prev,
          [aiMessage.id]: "Failed to analyze message for actions",
        }));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Failed to send message",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // If the AI message includes actions, allow click -> re-submit
  // ───────────────────────────────────────────────────────────
  const handleActionClick = async (action: string) => {
    const message = action.startsWith("suggest:")
      ? action.replace("suggest:", "")
      : action;
    await handleSubmit(message);
  };

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-zinc-900">

      {/* Scrollable container for messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="mx-auto max-w-3xl space-y-8 py-8">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              actions={messageActions[message.id]}
              onActionClick={handleActionClick}
              isParsing={
                !message.parsedData &&
                message.role === "assistant" &&
                message.id !== "1"
              }
              // Adjust how you want to show loading or error states
              isLoading={false}
              error={errors[message.id]}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
