import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaPaperclip } from "react-icons/fa";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@mui/material";

function ChatPage({ updateChatName, currentChatId }) {
  const { userId } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! How can I help you find a professor?",
      sender: "other",
      name: "PA",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScrapingMode, setIsScrapingMode] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (messages.length > 1) {
      updateChatName(messages);
    }
  }, [messages, updateChatName]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newMessage, userId, chatId: currentChatId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.reply)) {
          data.reply.forEach((prof) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: prevMessages.length + 1,
                text: `${prof.name} (${
                  prof.department || "Unknown Department"
                }): Rating ${prof.rating}, ${prof.recommendation || ""}`,
                sender: "other",
                name: "PA",
              },
            ]);
          });
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: prevMessages.length + 1,
              text: data.reply,
              sender: "other",
              name: "PA",
            },
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: "Sorry, there was an error processing your message. Please try again.",
            sender: "other",
            name: "PA",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleScrape = async () => {
    if (!websiteUrl.trim() || !newMessage.trim()) {
      alert("Please enter both a website URL and a query.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: websiteUrl, query: newMessage, userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: data.reply,
          sender: "other",
          name: "PA",
        },
      ]);

      setWebsiteUrl("");
      setNewMessage("");
      setIsScrapingMode(false);
    } catch (error) {
      console.error("Error scraping website:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: "Sorry, there was an error scraping the website. Please try again.",
          sender: "other",
          name: "PA",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
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
        {isLoading && (
          <div className="flex items-center justify-start mb-4">
            <div className="flex flex-col items-center mr-2 text-gray-500">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={20} />
            </div>
            <Skeleton variant="rounded" width={200} height={40} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed bottom-0 inset-x-0 px-4 py-5 bg-white border border-gray-300 rounded-t-lg">
        <div className="flex items-center w-full max-w-lg mx-auto">
          {isScrapingMode && (
            <input
              type="text"
              placeholder="Enter website URL"
              className="flex-grow p-2 border rounded-full focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base mb-2"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder={isScrapingMode ? "Enter your query" : "Search for professors or ask a question..."}
            className="flex-grow p-2 border rounded-full focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                isScrapingMode ? handleScrape() : handleSendMessage();
              }
            }}
          />
          <button
            onClick={() => setIsScrapingMode(!isScrapingMode)}
            className="bg-gray-200 text-gray-600 rounded-full p-2 ml-2 hover:bg-gray-300"
          >
            <FaPaperclip />
          </button>
          <button
            onClick={isScrapingMode ? handleScrape : handleSendMessage}
            className="bg-blue-500 text-white rounded-lg p-2 ml-2 hover:bg-blue-600 text-sm md:text-base"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
