import { useState, useRef, useEffect } from "react";
import "./App.css";
import { GoogleGenAI } from "@google/genai";
import MarkdownView from "react-showdown";
import { LoadingAnimation } from "./components/animations/LoadingAnimations";

interface Message {
  role: "user" | "model";
  content: string;
}

function App() {
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
  const chatWindow = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatWindow.current?.scrollTo({
      top: chatWindow.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  async function getChatResponse(userInput: string) {
    setIsLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: userInput,
    });

    console.log(response);
    setIsLoading(false);
    return {
      role: "model",
      content: response.text || "No response",
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage = { role: "user", content: userInput };
    setMessages([...messages, newMessage]);

    const assistantResponse = await getChatResponse(userInput);
    setMessages([...messages, newMessage, assistantResponse]);
    setUserInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div
        className="mb-4 h-96 overflow-auto border rounded p-4"
        ref={chatWindow}
      >
        {messages.map((msg: Message, index: number) =>
          msg.role === "user" ? (
            <div key={index} className="mb-2 text-right">
              <small className="block">You</small>
              <span className="inline-block p-2 rounded bg-gray-100">
                {msg.content}
              </span>
            </div>
          ) : (
            <div key={index} className="mb-2 text-left">
              <small className="block">Assistant</small>
              <MarkdownView
                markdown={msg.content}
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
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
