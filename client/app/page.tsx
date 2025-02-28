import { ChatInterface } from "@/components/chat/ChatInterface";
import { Header } from "@/components/Header";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}
