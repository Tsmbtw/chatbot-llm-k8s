import React, { useState } from "react";
import Message from "./Message";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.text }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Unable to reach backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 w-96 h-[600px] rounded-2xl shadow-lg flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <Message key={i} sender={m.sender} text={m.text} />
        ))}
        {loading && (
          <div className="text-gray-400 text-sm animate-pulse">
            Bot is typing...
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="flex border-t border-gray-700">
        <input
          className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-bl-2xl focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded-br-2xl text-white"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;

