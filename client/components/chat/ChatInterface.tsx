"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message, MessageActions } from "@/types/chat";
import { useWallet } from "../../providers/WalletContext";

const sessionId = "42";

export function ChatInterface() {
  // Access wallet context
  const { address, selectedNetwork } = useWallet();
  
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

  // Update session ID when wallet changes
  useEffect(() => {
    // If wallet is connected, use that as part of the session ID
    // This helps maintain separate chat histories per wallet
    if (address) {
      console.log(`Wallet connected: ${address} on ${selectedNetwork.name}`);
    }
  }, [address, selectedNetwork]);

  const handleSubmit = async (userInput?: string) => {
    const finalInput = userInput || input;
    if (!finalInput.trim() || isLoading) return;

    // Inject wallet information if connected
    let enrichedInput = finalInput;
    if (address && finalInput.toLowerCase().includes("balance")) {
      // If the user is asking about balances, automatically include their address
      enrichedInput = `${finalInput} for wallet ${address} on ${selectedNetwork.name}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: finalInput, // Show what the user actually typed
      role: "user",
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setErrors({});

    try {
      // Use the enriched input for the API call but show the original input to the user
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: enrichedInput, // Send enriched input to the API
          sessionId: address ? `${sessionId}-${address.substring(2, 10)}` : sessionId // Include wallet in session ID if available
        }),
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

      // Parse the AI message
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
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Scrollable container for messages */}
      <ScrollArea className="flex-1 px-4 pb-32"> {/* Increased bottom padding to make space for fixed input */}
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

      {/* Fixed input area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 shadow-lg z-10">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          {address && (
            <div className="mt-2 text-xs text-zinc-500 flex items-center">
              <span className="mr-2">Connected:</span>
              <span className="text-blue-400">{address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
              <span className="mx-2 text-zinc-600">|</span>
              <span className="flex items-center">
                <span className="mr-1">{selectedNetwork.icon}</span>
                {selectedNetwork.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
