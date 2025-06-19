import { useState, useRef, useEffect } from "react";
import MarkdownView from "react-showdown";
import { LoadingAnimation } from "./animations/LoadingAnimations";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatProps {
  conversation?: Conversation;
  onSendMessage: (input: string) => void;
  isLoading: boolean;
}

function Chat({ conversation, onSendMessage, isLoading }: ChatProps) {
  const [userInput, setUserInput] = useState("");

  const chatWindow = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatWindow.current) {
      const chatDiv = chatWindow.current;
      // Find the latest user message element
      const userMessages = chatDiv.querySelectorAll("div.text-right");
      if (userMessages.length > 0) {
        const latestUserMsg = userMessages[
          userMessages.length - 1
        ] as HTMLElement;
        // Only scroll if content is overflowing
        if (chatDiv.scrollHeight > chatDiv.clientHeight) {
          chatDiv.scrollTo({
            top: latestUserMsg.offsetTop - 50,
            behavior: "smooth",
          });
          console.log(latestUserMsg.offsetTop);
        }
      }
    }
    console.log(chatWindow.current?.scrollHeight);
    console.log(chatWindow.current?.clientHeight);
  }, [conversation?.messages]);

  return (
    <div className="rounded-lg shadow-lg border border-gray-700 w-full h-[90dvh] gap-6 flex flex-col p-2 flex-1 ">
      <div
        className="mb-2 flex flex-col flex-1 overflow-y-auto p-4"
        ref={chatWindow}
      >
        <div className="mt-auto">
          {conversation?.messages.map((msg: Message, index: number) =>
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
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage(userInput);
          setUserInput("");
        }}
        className="flex gap-2 px-4 pb-4"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 p-2 border rounded bg-gray-100"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-[#0e1a13] font-bold rounded"
          disabled={!userInput.trim() || isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
