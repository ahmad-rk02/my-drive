// components/FileItem.jsx
import React from 'react';
import {
    DocumentTextIcon,
    FolderIcon,
    StarIcon as StarSolid,
    ArrowDownTrayIcon,
    PencilIcon,
    TrashIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

export default function FileItem({
    item,
    onClick,
    onStar,
    onTrash,
    onRestore,
    onPermanentDelete,
    onRename,
    onDownload,
    isGrid = false,
    isTrash = false,
}) {
    const isFolder = item.type === 'folder' || !item.storage_path;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Unknown';
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const displayDate = isTrash
        ? `Trashed: ${formatDate(item.updated_at || item.created_at)}`
        : item.updated_at !== item.created_at
            ? `Modified: ${formatDate(item.updated_at)}`
            : `Created: ${formatDate(item.created_at)}`;

    const icon = isFolder ? (
        <FolderIcon className="h-9 w-9 sm:h-11 sm:w-11 text-yellow-500 flex-shrink-0" />
    ) : (
        <DocumentTextIcon className="h-9 w-9 sm:h-11 sm:w-11 text-blue-500 flex-shrink-0" />
    );

    return (
        <div
            onClick={() => onClick?.(item)}
            className={`
        group relative
        border border-gray-200 dark:border-gray-700
        rounded-xl cursor-pointer transition-all duration-200
        overflow-hidden
        hover:shadow-sm hover:border-blue-400/50 dark:hover:border-blue-500/50
        ${isGrid
                    ? 'flex flex-col items-center text-center p-3 sm:p-4 aspect-square'
                    : 'flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4'}
        ${isTrash ? 'opacity-80 hover:opacity-100 bg-gray-50/50 dark:bg-gray-800/30' : ''}
      `}
        >
            {/* Icon */}
            <div className={isGrid ? 'mb-2' : ''}>{icon}</div>

            {/* Name + Date */}
            <div className={`${isGrid ? 'text-center w-full' : 'flex-1 min-w-0'}`}>
                <p
                    className="
            font-medium text-gray-900 dark:text-white
            text-sm sm:text-base leading-tight
            truncate
            max-w-full
          "
                    title={item.name} // full name on hover/tooltip
                >
                    {item.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-full">
                    {displayDate}
                </p>
            </div>

            {/* Action buttons - appear on hover or always visible on mobile */}
            {!isGrid && (
                <div
                    className="
            flex items-center gap-1 sm:gap-1.5
            opacity-70 sm:opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            mt-2 sm:mt-0
          "
                >
                    {/* Star */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onStar?.(item);
                        }}
                        className="p-1.5 sm:p-2 hover:bg-yellow-100/60 dark:hover:bg-yellow-900/30 rounded-full transition"
                        title={item.is_starred ? 'Unstar' : 'Star'}
                    >
                        {item.is_starred ? (
                            <StarSolid className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <StarOutline className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                    </button>

                    {isTrash ? (
                        <>
                            {/* Restore */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRestore?.(item);
                                }}
                                className="p-1.5 sm:p-2 hover:bg-green-100/60 dark:hover:bg-green-900/30 rounded-full transition"
                                title="Restore"
                            >
                                <ArrowPathIcon className="h-5 w-5 text-green-600" />
                            </button>

                            {/* Permanent Delete */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPermanentDelete?.(item);
                                }}
                                className="p-1.5 sm:p-2 hover:bg-red-100/60 dark:hover:bg-red-900/30 rounded-full transition"
                                title="Delete permanently"
                            >
                                <TrashIcon className="h-5 w-5 text-red-600" />
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Trash */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTrash?.(item);
                                }}
                                className="p-1.5 sm:p-2 hover:bg-red-100/60 dark:hover:bg-red-900/30 rounded-full transition"
                                title="Move to trash"
                            >
                                <TrashIcon className="h-5 w-5 text-red-500" />
                            </button>

                            {/* Rename */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRename?.(item);
                                }}
                                className="p-1.5 sm:p-2 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 rounded-full transition"
                                title="Rename"
                            >
                                <PencilIcon className="h-5 w-5 text-blue-600" />
                            </button>

                            {/* Download */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload?.(item);
                                }}
                                className="p-1.5 sm:p-2 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/30 rounded-full transition"
                                title="Download"
                            >
                                <ArrowDownTrayIcon className="h-5 w-5 text-indigo-600" />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Grid view actions - always visible */}
            {isGrid && (
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onStar?.(item);
                        }}
                        className="p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm hover:bg-yellow-100/80"
                    >
                        {item.is_starred ? (
                            <StarSolid className="h-4 w-4 text-yellow-400" />
                        ) : (
                            <StarOutline className="h-4 w-4 text-gray-500" />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}