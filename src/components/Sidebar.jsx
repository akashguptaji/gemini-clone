// src/components/Sidebar.jsx
const Sidebar = ({ history, onSelect }) => {
  return (
    <div className="bg-zinc-900 text-white h-screen p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Past Chats</h2>
      <ul className="space-y-2 overflow-y-auto max-h-[80vh]">
        {history.length === 0 && <li className="text-sm text-gray-400">No history yet.</li>}
        {history.map((item, index) => (
          <li
            key={index}
            onClick={() => onSelect(item)}
            className="cursor-pointer p-2 rounded hover:bg-zinc-700 transition"
          >
            {item.question.slice(0, 40)}...
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
