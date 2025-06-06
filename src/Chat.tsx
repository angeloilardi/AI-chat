import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./index.css";
import { GoogleGenAI } from "@google/genai";
import MarkdownView from "react-showdown";
import { LoadingAnimation } from "./components/animations/LoadingAnimations";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

function Chat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatMessages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(messages.length > 0);

  const chatWindow = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatWindow.current?.scrollTo({
      top: chatWindow.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    console.log(messages);
  }, [messages]);

  const handleResume = () => {
    setShowResumePrompt(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowResumePrompt(false);
  };

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  const ResumePrompt = () => (
    <div className="bg-yellow-100 p-4 rounded mb-4">
      <p className="text-yellow-800">
        You have a previous conversation. Would you like to continue or start a
        new chat?
      </p>
      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => handleNewChat()}
          className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
        >
          Start New Chat
        </button>
        <button
          onClick={() => handleResume()}
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        >
          Continue Chat
        </button>
      </div>
    </div>
  );

  async function getChatResponse(userInput: string) {
    setIsLoading(true);
    try {
      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: messages,
      });
      const response = await chat.sendMessage({ message: userInput });
      setIsLoading(false);
      return {
        role: "model",
        parts: [{ text: response.text || "No response" }],
      };
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        console.error("Error getting chat response:", error.message);
      } else {
        console.error("Error getting chat response:", error);
      }
      return {
        role: "model",
        parts: [{ text: "Sorry, there was an error processing your request." }],
      };
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage = { role: "user", parts: [{ text: userInput }] };
    setMessages((prevMessages: Message[]) => [...prevMessages, newMessage]);

    const assistantResponse = await getChatResponse(userInput);
    setMessages((prevMessages: Message[]) => [
      ...prevMessages,
      assistantResponse,
    ]);
    setUserInput("");
  };

  return (
    <div className="mx-auto p-6">
      {showResumePrompt ? (
        <ResumePrompt />
      ) : (
        <div>
          <div
            className="mb-4 h-96 overflow-auto flex flex-col"
            ref={chatWindow}
          >
            {messages.map((msg: Message, index: number) =>
              msg.role === "user" ? (
                <div key={index} className="mb-2 text-right">
                  <small className="block text-gray-100">You</small>
                  <span className="inline-block p-2 rounded bg-gray-100">
                    {msg.parts[0]?.text}
                  </span>
                </div>
              ) : (
                <div key={index} className="mb-2 text-left">
                  <small className="block text-gray-100">Assistant</small>
                  <MarkdownView
                    markdown={msg.parts[0].text}
                    className="bg-blue-100 p-2 rounded"
                  />
                </div>
              )
            )}
            {isLoading && <LoadingAnimation />}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 p-2 border rounded bg-gray-100"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#40ffaa] to-[#4079ff] text-[#0e1a13] font-bold rounded"
              disabled={!userInput.trim() || isLoading}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
