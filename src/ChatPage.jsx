// src/ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChat } from "./lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChat(text); // POSTs to /chat with { text }
      const reply = typeof data?.response === "string" ? data.response : "No response.";
      setMessages((m) => [...m, { sender: "q", text: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { sender: "q", text: "Error connecting to Q." }]);
      // optional: console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-md">
        <CardContent className="p-4 space-y-4">
          <h1 className="text-xl font-semibold">QPF AI Chat Test</h1>

          <ScrollArea className="h-[50vh] w-full rounded border" ref={scrollRef}>
            <div className="p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="text-sm text-gray-500">Say hi to Q to start.</div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.sender === "user"
                        ? "text-right"
                        : "text-left"
                    }
                  >
                    <span
                      className={
                        m.sender === "user"
                          ? "inline-block bg-blue-600 text-white px-3 py-2 rounded-lg"
                          : "inline-block bg-gray-200 text-gray-900 px-3 py-2 rounded-lg"
                      }
                    >
                      {m.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={loading ? "Thinking..." : "Type a message"}
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}