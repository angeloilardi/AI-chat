import { useState } from "react";
import GradientText from "./blocks/GradientText/GradientText";
import Chat from "./Chat";

export default function App() {
  const [showChat, setShowChat] = useState(false);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={10}
          showBorder={false}
          className="text-6xl font-bold mb-4 text-center"
        >
          Welcome to Flux
        </GradientText>
        <button
          className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full p-4 bg-gradient-to-r from-[#40ffaa] to-[#4079ff] text-[#0e1a13] my-6 w-auto font-bold"
          onClick={() => setShowChat(true)}
        >
          <span className="truncate">Start Chatting</span>
        </button>
      </div>
      {showChat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="bg-gradient-to-r from-[#485563] to-[#29323c] bg-opacity-10 rounded-lg shadow-lg border border-gray-700 p-2 max-w-3xl w-[90%] relative">
            <button
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowChat(false)}
            >
              ×
            </button>
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
}
