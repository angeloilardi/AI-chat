// src/components/WelcomeScreen.tsx
import React from "react";
import GradientText from "../blocks/GradientText/GradientText";

interface WelcomeScreenProps {
  onStartNewChat: () => void;
  onContinuePreviousChats: () => void;
  hasPreviousChats: boolean; // Prop to know if there are any saved conversations
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartNewChat,
  onContinuePreviousChats,
  hasPreviousChats,
}) => {
  const gradientClasses = "bg-gradient-to-r from-[#485563] to-[#29323c]";
  const buttonBaseClasses =
    "text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75";
  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
      <GradientText className="text-5xl md:text-7xl font-extrabold mb-8">
        Welcome to FLUX
      </GradientText>
      <p className="text-lg md:text-xl mb-12 max-w-2xl">
        Your personal AI assistant. How can I help you today?
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={onStartNewChat}
          className={`${gradientClasses} ${buttonBaseClasses} focus:ring-blue-500`}
        >
          Start a New Chat
        </button>
        {hasPreviousChats && (
          <button
            onClick={onContinuePreviousChats}
            className={`${gradientClasses} ${buttonBaseClasses} focus:ring-gray-500`}
          >
            Continue Previous Chats
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
