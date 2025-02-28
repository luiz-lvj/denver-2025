"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message, MessageActions } from "@/types/chat";

const sessionId = "42";

export function ChatInterface() {
  // Create a ref for the end div that we'll scroll to
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ───────────────────────────────────────────────────────────
  // Existing chat states
  // ───────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `**Hello!** I'm your AI assistant with a variety of helpful tools:

**Blockchain & Tokens:**
- **Token Balance Checks**
  Check token balances on Ethereum, Base, and Mode networks
  Supported tokens: DAI on Ethereum mainnet, plus custom tokens
  Example: "What's my DAI balance on Ethereum mainnet?" or "Check token 0x123... for wallet 0xabc..."

**Information Services:**
- **Weather Information**
  Get current weather for any location
  Example: "What's the weather in Tokyo?"
  
- **Web Search**
  Search the web for real-time information
  Example: "Search for latest Ethereum news" or "Look up blockchain conferences in 2025"

**Utilities:**
- **Number Calculations**
  Add numbers together quickly
  Example: "What's 1538 + 2947?"
  
- **Secret Number**
  Get a "secret" random number when needed
  Example: "Give me a secret number"

How can I assist you today?`
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

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // chat route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalInput, sessionId }),
      });
      const data = await response.json();
      console.log("Response from server:", data);

      // Create a new AI message from the server's response
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
    <div className="flex h-full flex-col bg-zinc-900">

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
              isLoading={false}
              error={errors[message.id]}
            />
          ))}
          {/* This empty div serves as our scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-zinc-800">
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
