import { IoMdAddCircle, IoIosChatbubbles } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import GradientText from "../blocks/GradientText/GradientText";

interface SidebarProps {
  conversations: { id: string; title: string }[];
  activeId: string | null;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  isOpen?: boolean;
}

export default function Sidebar({
  conversations,
  activeId,
  onCreate,
  onDelete,
  onSelect,
}: SidebarProps) {
  return (
    <div>
      <div className="text-left mb-6">
        <GradientText className="text-4xl font-bold mb-4 !mx-0">
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
      <p className="mb-4 font-bold">Coversations</p>
      {conversations.map((conversation) => (
        <li
          className={`flex items-center gap-2 mb-2 p-2 cursor pointer rounded-md ${
            activeId === conversation.id
              ? "bg-gray-300 text-black"
              : "hover:bg-gray-600"
          }`}
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
        >
          <IoIosChatbubbles />
          {conversation.title}
          <button
            onClick={() => onDelete(conversation.id)}
            className="ml-auto cursor-pointer"
          >
            <MdOutlineDelete />
          </button>
        </li>
      ))}
    </div>
  );
}
