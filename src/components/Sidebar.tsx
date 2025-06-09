import { IoMdAddCircle, IoIosChatbubbles } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import GradientText from "../blocks/GradientText/GradientText";
import { useRef } from "react";
import useClickOutside from "./hooks/useClickOutside";

interface SidebarProps {
  conversations: { id: string; title: string }[];
  activeId: string | null;
  onCreate: () => void;
  onClear: (id: string) => () => void;
  onSelect: (id: string) => void;
  isOpen?: boolean;
}

export default function Sidebar({
  conversations,
  activeId,
  onCreate,
  onClear,
  onSelect,
  isOpen,
}: SidebarProps) {
  const sidebarRef = useRef(null! as HTMLDivElement);

  useClickOutside(sidebarRef, () => (isOpen = false));

  return (
    <div
      ref={sidebarRef}
      className={`
          fixed z-30 inset-y-0 left-0 transform
          bg-gray-900 text-white w-80 md:w-1/3 p-4
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex md:flex-col md:shrink-0
        `}
    >
      <div className="text-left mb-6">
        <GradientText className="text-4xl font-bold mb-4 text-left">
          FLUX
        </GradientText>
        <p className="text-gray-300">Powered by Google Gemini AI</p>
      </div>
      <button
        type="button"
        className="flex items-center gap-2 mb-4 hover:text-gray-300 border border-gray-600 p-2 rounded-md w-fit"
        onClick={onCreate}
      >
        <IoMdAddCircle />
        New Chat
      </button>
      <span>Coversations</span>
      {conversations.map((conversation) => (
        <ul>
          <li
            className={`flex items-center gap-2 mb-2 p-2 rounded-md ${
              activeId === conversation.id ? "bg-gray-300 text-black" : ""
            }`}
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
          >
            <IoIosChatbubbles />
            {conversation.title}
            <button
              onClick={onClear(conversation.id)}
              className="ml-auto cursor-pointer"
            >
              <MdOutlineDelete />
            </button>
          </li>
        </ul>
      ))}
    </div>
  );
}
