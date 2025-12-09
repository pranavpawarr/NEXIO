"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIChat } from "@/hooks/use-ai-chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// 1. DEFINE THE INTERFACE HERE
interface DocumentData {
  id: string;
  title: string;
  content?: string;
}

interface Message {
  role: "user" | "ai";
  content: string;
}

export const AIChatModal = () => {
  const chatStore = useAIChat();
  const params = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. PASS THE TYPE TO USEQUERY HERE <DocumentData>
  const { data: document } = useQuery<DocumentData>({
    queryKey: ["document", params.documentId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${params.documentId}`);
      if (!res.ok) throw new Error("Failed to fetch document");
      return res.json();
    },
    enabled: !!params.documentId,
  });

  const onSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          prompt: userMessage,
          context: document?.content || "",
        }),
      });

      if (!response.ok) {
        // READ THE ERROR TEXT FROM SERVER
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (error: any) {
      // Show the specific error in the toast
      toast.error(error.message || "AI failed to respond.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the file (handleKeyDown and Return) is fine
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Dialog open={chatStore.isOpen} onOpenChange={chatStore.onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#1F1F1F]">
        <DialogHeader className="px-6 pt-6 pb-2 border-b">
          <DialogTitle className="flex items-center gap-x-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-500 fill-purple-500" />
            Ask AI
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              Powered by Gemini
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col gap-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-sm text-center">
                <Bot className="h-12 w-12 mb-4 opacity-20" />
                <p>Ask me anything about this document!</p>
                <p className="text-xs mt-2">"Summarize this page"</p>
                <p className="text-xs">"What are the action items?"</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-x-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={
                      msg.role === "ai"
                        ? "bg-purple-500 text-white"
                        : "bg-neutral-200"
                    }
                  >
                    {msg.role === "ai" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`rounded-lg p-3 text-sm max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
          <div className="flex gap-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
            />
            <Button
              onClick={onSend}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
