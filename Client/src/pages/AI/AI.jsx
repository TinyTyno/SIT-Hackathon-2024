import React, { useState, useEffect, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import "./AI.css";
import UserContext from "@/contexts/UserContext";
import StableSidebar from "@/components/StableSidebar";
import Navbar from "@/components/Navbar";

const AIChat = () => {
  const {user} = useContext(UserContext)
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const [chatModel, setChatModel] = useState(null);

  useEffect(() => {
    if (!API_KEY) {
      setError("API Key is missing. Please set VITE_API_KEY in your environment variables.");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat();

      // Add a system message to instruct the AI
      chat.sendMessage("You are a financial expert who only provides information related to stocks and finances.");

      setChatModel(chat);
    } catch (err) {
      console.error(err);
      setError("Failed to initialize the AI model.");
    }
  }, [API_KEY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatModel) return;

    const userMessage = { role: "user", text: input };
    setConversation((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    try {
      const result = await chatModel.sendMessage(input);
      const aiResponse = result.response.text();

      // Simple filtering to ensure response is about stocks or finances
      if (aiResponse.toLowerCase().includes("stock") || aiResponse.toLowerCase().includes("finance")) {
        const aiMessage = { role: "ai", text: aiResponse };
        setConversation((prev) => [...prev, aiMessage]);
      } else {
        const aiMessage = { role: "ai", text: "Sorry, I can only provide information about stocks and finances." };
        setConversation((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get response from AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container animated-bg">
      {user? 
      <StableSidebar>
      <div className="relative flex flex-col h-screen bg-gray-100 dark:bg-gray-700 pt-[44px]">
        <div className="flex-grow overflow-y-auto px-[2em]">
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-xs p-3 mb-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-gray-800 self-start"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.text}
            </motion.div>
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            disabled={isLoading || !chatModel}
          />
          <Button
            type="submit"
            className="p-2 h-full bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || !chatModel}
            variant="contained"
          >
            <AiOutlineSend size={20} />
          </Button>
        </form>
      </div>
      </StableSidebar>:
      <>
      <Navbar fixed={true}/>
      <div className="relative flex flex-col h-screen bg-gray-100 dark:bg-gray-700 pt-[44px]">
        <div className="flex-grow w-[85%] m-auto overflow-y-auto py-[3em] px-[2em]">
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-xs p-3 mb-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-gray-800 self-start"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.text}
            </motion.div>
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            disabled={isLoading || !chatModel}
          />
          <Button
            type="submit"
            className="p-2 h-full bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || !chatModel}
            variant="contained"
          >
            <AiOutlineSend size={20} />
          </Button>
        </form>
      </div>
      </>}
    </div>
  );
};

export default AIChat;
