```jsx
// src/ChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
-import axios from "axios";
+import { sendChat } from "@/lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    // Append user message
    setMessages((m) => [...m, { sender: "user", text: input }]);
    setLoading(true);

    try {
      // Send chat via centralized helper
      const data = await sendChat(input, "testuser");
      // Append Q's response
      setMessages((m) => [...m, { sender: "q", text: data.response }]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages((m) => [...m, { sender: "q", text: "Error connecting to Q." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollRef} className="flex-1 overflow-auto p-4">
        {messages.map((msg, idx) => (
          <Card key={idx} className={msg.sender === "user" ? "self-end bg-blue-100" : "self-start bg-gray-100"}>
            <CardContent>{msg.text}</CardContent>
          </Card>
        ))}
      </ScrollArea>

      <div className="flex p-4 border-t">
        <Input
          className="flex-1 mr-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) sendMessage();
          }}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? 'Sending…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
```
}]}
        ...m,
        { sender: "q", text: "Error connecting to Q." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4">
      <header className="text-2xl font-bold mb-4 text-center">
        QPF AI Chat Test
      </header>
      <Card className="flex-1 mb-4">
        <CardContent className="p-0">
          <ScrollArea ref={scrollRef} className="h-full px-4 py-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`my-2 ${m.sender === "q" ? "text-left" : "text-right"}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    m.sender === "q"
                      ? "bg-white shadow"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 mr-2"
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
