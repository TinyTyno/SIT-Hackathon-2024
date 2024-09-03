import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiOutlineSend } from "react-icons/ai";

const AIChat = () => {
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
      const aiMessage = { role: "ai", text: result.response.text() };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to get response from AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] border-[5px] border-[#1C1C1E] overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[200px] h-[30px] bg-black rounded-b-[20px]"></div>



        {/* Chat interface */}
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-700 pt-[44px] pb-[34px] px-4">
          <div className="flex-grow overflow-y-auto">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs p-3 mb-2 rounded-lg ${
                  msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-gray-800 self-start"
                }`}
              >
                <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.text}
              </div>
            ))}
            {isLoading && <div className="text-sm italic text-gray-500">AI is typing...</div>}
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              disabled={isLoading || !chatModel}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading || !chatModel}
            >
              <AiOutlineSend size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
