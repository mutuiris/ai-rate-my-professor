import React, { useState } from "react";
import { FaUser } from "react-icons/fa";

function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! How can I help you find a professor?", sender: "other" },
    { id: 1, text: "Hi there!", sender: "other", name: "PA" },
    { id: 2, text: "Hello!", sender: "user" },
    { id: 3, text: "How are you?", sender: "other", name: "PA" },
    { id: 4, text: "I'm good, thanks! How about you?", sender: "user" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newMessage }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const recommendations = JSON.parse(data.reply);
        formattedReply += recommendations.map(prof => 
          `${prof.name} (${prof.department || 'Unknown Department'}): Rating ${prof.rating}, Similarity: ${prof.similarity.toFixed(2)}`
        ).join('\n');
        const formattedReply = recommendations
          .map(
            (prof) =>
              `${prof.name} (${
                prof.department || "Unknown Department"
              }): Rating ${prof.rating}, Similarity: ${prof.similarity.toFixed(
                2
              )}`
          )
          .join("\n");

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: formattedReply,
            sender: "other",
            name: "PA",
          },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text: "Sorry, there was an error processing your request. Please try again.", sender: "other" }]);
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: "Sorry, there was an error processing your message.",
            sender: "other",
            name: "PA",
          },
        ]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-center ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            {message.sender === "other" && (
              <div className="flex flex-col items-center mr-2 text-gray-500">
                <div className="w-8 h-8 border-2 border-blue-500 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-500 text-xl" />
                </div>
                <span className="text-xs">{message.name}</span>
              </div>
            )}
            <div
              className={`${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              } rounded-lg px-4 py-2 max-w-xs`}
            >
              {message.text}
            </div>
            {message.sender === "user" && (
              <div className="flex flex-col items-center ml-2 text-black">
                <div className="w-8 h-8 border-2 border-gray-500 rounded-full flex items-center justify-center">
                  <FaUser className="text-black text-xl" />
                </div>
                <span className="text-xs">You</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-4/5 ml-12 rounded-full p-4 bg-white border border-gray-300">
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="Search for professors or ask a question..."
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
