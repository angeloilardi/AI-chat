import { IoMdAddCircle, IoIosChatbubbles } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";

interface SidebarProps {
  conversations: { id: string; title: string }[];
  activeId: string | null;
  onCreate: () => void;
  onClear: (id: string) => () => void;
  onSelect: (id: string) => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onCreate,
  onClear,
  onSelect,
}: SidebarProps) {
  return (
    <div className="w-1/3 bg-gradient-to-r from-[#485563] to-[#29323c] rounded-lg shadow-lg border border-gray-700 p-2 relative flex flex-col text-gray-100 overflow-scroll h-[90dvh]">
      <button
        type="button"
        className="flex items-center gap-2 mb-4 hover:text-gray-300"
        onClick={onCreate}
      >
        <IoMdAddCircle />
        New Chat
      </button>
      <span>Coversations</span>
      {conversations.map((conversation) => (
        <ul>
          <li
            className={`flex items-center gap-2 mb-2 hover:text-gray-300 p-2 rounded-md ${
              activeId === conversation.id ? "bg-black" : ""
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
