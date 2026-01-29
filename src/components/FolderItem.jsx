import { FiFolder, FiMoreVertical, FiStar } from "react-icons/fi";
import { useState } from "react";

export default function FolderCard({ folder, onOpen, onTrash, onRename, starred }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            className="border p-3 sm:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative cursor-pointer w-full sm:w-auto"
            onDoubleClick={() => onOpen(folder)}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    <FiFolder className="text-yellow-500" size={28} />
                    <div className="mt-1 font-semibold text-sm sm:text-base truncate max-w-[150px] sm:max-w-xs">
                        {folder.name}
                    </div>
                    {starred && <FiStar size={16} className="text-yellow-500" />}
                </div>

                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <FiMoreVertical size={20} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 sm:w-32 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg flex flex-col gap-1 p-2 z-50">
                            <button
                                onClick={() => {
                                    onRename(folder);
                                    setMenuOpen(false);
                                }}
                                className="text-left text-sm sm:text-base px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                Rename
                            </button>
                            <button
                                onClick={() => {
                                    onTrash(folder);
                                    setMenuOpen(false);
                                }}
                                className="text-left text-sm sm:text-base px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                Move to Trash
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
