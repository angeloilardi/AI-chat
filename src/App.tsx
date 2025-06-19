import { useCallback, useEffect, useRef, useState } from "react";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import GradientText from "./blocks/GradientText/GradientText";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import useClickOutside from "./components/hooks/useClickOutside";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export default function App() {
  // Initialize conversations and currentChatID together to avoid referencing each other
  const getInitialConversations = () => {
    const saved = localStorage.getItem("conversations");
    if (saved && saved !== "[]") {
      return JSON.parse(saved) as Conversation[];
    } else {
      return [
        {
          id: uuidv4(),
          title: "New chat",
          messages: [],
        },
      ];
    }
  };

  const initialConversations = getInitialConversations();
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [currentChatID, setCurrentChatID] = useState<string | null>(
    initialConversations.length > 0 ? initialConversations[0].id : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

  useEffect(() => {
    if (currentChatID && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [currentChatID]);
  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  async function getChatResponse(userInput: string) {
    setIsLoading(true);
    try {
      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: activeConversation?.messages,
      });
      const response = await chat.sendMessage({ message: userInput });
      console.log("Chat response:", response);
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

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
    console.log("Conversations saved to localStorage:", conversations);
  }, [conversations]);

  const createNewConversation = () => {
    const newConv = {
      id: uuidv4(),
      title: `New chat`,
      messages: [],
    };
    setConversations([...conversations, newConv]);
    setCurrentChatID(newConv.id);
  };

  const deleteSelectedConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (currentChatID === id) {
      setCurrentChatID(conversations[0]?.id || null);
    }
  };

  const activeConversation = conversations.find((c) => c.id === currentChatID);

  const handleSubmit = async (userInput: string) => {
    // If there are no conversations, create a new one and set it as active
    if (!activeConversation) {
      const newConvId = uuidv4();
      const newConv: Conversation = {
        id: newConvId,
        title: "New chat",
        messages: [{ role: "user", parts: [{ text: userInput }] }],
      };
      setConversations([...conversations, newConv]);
      setCurrentChatID(newConvId);
      const assistantResponse = await getChatResponse(userInput);
      setConversations((prev: Conversation[]) =>
        prev.map((conv) =>
          conv.id === newConvId
            ? {
                ...conv,
                messages: [...conv.messages, assistantResponse as Message],
              }
            : conv
        )
      );
      return;
    }

    setConversations((prev: Conversation[]) =>
      prev.map((conv) =>
        conv.id === currentChatID
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { role: "user", parts: [{ text: userInput }] },
              ],
            }
          : conv
      )
    );
    const assistantResponse = await getChatResponse(userInput);
    setConversations((prev: Conversation[]) =>
      prev.map((conv) =>
        conv.id === currentChatID
          ? {
              ...conv,
              messages: [...conv.messages, assistantResponse as Message],
            }
          : conv
      )
    );
  };

  const fetchTitle = useCallback(async () => {
    if ((activeConversation?.messages?.length ?? 0) > 1) {
      try {
        const chat = ai.chats.create({
          model: "gemini-2.0-flash",
          history: activeConversation?.messages,
        });
        // Only fetch title if it hasn't been set by the user or AI yet
        if (activeConversation?.title === "New chat") {
          const response = await chat.sendMessage({
            message:
              "Create a summary for this conversation using 5 words in one sentence",
          });
          if (response.text) {
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === currentChatID
                  ? {
                      ...conv,
                      title: response.text ?? "Untitled Conversation",
                    }
                  : conv
              )
            );
          }
        }
      } catch (error) {
        console.error("Error getting chat response:", error);
      }
    }
  }, [
    activeConversation?.messages,
    activeConversation?.title,
    ai.chats,
    currentChatID,
  ]);

  useEffect(() => {
    fetchTitle();
  }, [activeConversation?.messages, currentChatID, fetchTitle]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null! as HTMLDivElement);

  useClickOutside(sidebarRef, () => setIsSidebarOpen(false));

  return (
    <div
      className={"h-screen flex bg-gradient-to-r from-[#485563] to-[#29323c]"}
    >
      <div
        ref={sidebarRef}
        className={`
          fixed z-30 inset-y-0 left-0 transform
          bg-gray-900 text-white w-80 md:w-1/3 p-4
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex md:flex-col md:shrink-0
        `}
      >
        <Sidebar
          conversations={conversations}
          activeId={currentChatID}
          onCreate={createNewConversation}
          onClear={(id: string) => () => deleteSelectedConversation(id)}
          onSelect={(id: string) => setCurrentChatID(id)}
          isOpen={isSidebarOpen}
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex gap-4">
          <button
            className="text-gray-100 p-2 z-50 md:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            {/* Toggle sidebar visibility on mobile */}
            {isSidebarOpen ? (
              <IoMdClose size={20} />
            ) : (
              <CiMenuBurger size={20} />
            )}
          </button>
          <GradientText className="text-4xl font-bold pl-4 !mx-0 md:hidden">
            FLUX
          </GradientText>
        </div>
        <Chat
          conversation={activeConversation}
          onSendMessage={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
