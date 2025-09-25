import React from "react";

function Message({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md
          ${isUser 
            ? "bg-blue-600 text-white rounded-br-sm" 
            : "bg-gray-700 text-gray-200 rounded-bl-sm"
          }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;

