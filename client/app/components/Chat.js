import React, { useState } from "react";

function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there!", sender: "other" },
    { id: 2, text: "Hello!", sender: "user" },
    { id: 3, text: "How are you?", sender: "other" },
    { id: 4, text: "I'm good, thanks! How about you?", sender: "user" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "user" },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              } rounded-lg px-4 py-2 max-w-xs`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-4/5 ml-12 rounded-full p-4 bg-white border border-gray-300">
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-full focus:outline-none focus:ring focus:border-blue-300"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
