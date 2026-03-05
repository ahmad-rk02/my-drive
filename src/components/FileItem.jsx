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
        <FolderIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-yellow-500 drop-shadow-sm flex-shrink-0" />
    ) : (
        <DocumentTextIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-500 drop-shadow-sm flex-shrink-0" />
    );

    return (
        <div
            onClick={() => onClick?.(item)}
            className={`
                group relative
                border border-gray-200 dark:border-slate-700
                rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300
                overflow-hidden
                hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-400/50 dark:hover:border-blue-500/50
                hover:-translate-y-0.5
                bg-white dark:bg-slate-900
                ${isGrid
                    ? 'flex flex-col items-center text-center p-3 sm:p-4 md:p-5 aspect-square'
                    : 'flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4'}
                ${isTrash ? 'opacity-70 hover:opacity-100 bg-gray-50/50 dark:bg-slate-800/30' : ''}
            `}
        >
            {/* Icon */}
            <div className={isGrid ? 'mb-2 sm:mb-3' : 'flex-shrink-0'}>{icon}</div>

            {/* Name + Date + Actions Container */}
            <div className={`${isGrid ? 'text-center w-full px-1 sm:px-2' : 'flex-1 min-w-0 w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2'}`}>
                {/* Name + Date */}
                <div className="flex-1 min-w-0 overflow-hidden">
                    <p
                        className="
                            font-semibold text-gray-900 dark:text-white
                            text-sm sm:text-base leading-tight
                            line-clamp-2 break-words
                            w-full
                        "
                        title={item.name}
                    >
                        {item.name}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 line-clamp-1 w-full">
                        {displayDate}
                    </p>
                </div>

                {/* Action buttons - list view */}
                {!isGrid && (
                    <div
                        className="
                            flex items-center gap-1.5 sm:gap-2
                            opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                            transition-opacity duration-200
                            flex-shrink-0 justify-end sm:justify-start
                            mt-2 sm:mt-0
                        "
                    >
                        {isTrash ? (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStar?.(item); }}
                                    className="p-2 sm:p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg sm:rounded-xl transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title={item.is_starred ? 'Unstar' : 'Star'}
                                >
                                    {item.is_starred ? (
                                        <StarSolid className="h-5 w-5 text-yellow-500" />
                                    ) : (
                                        <StarOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    )}
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onRestore?.(item); }}
                                    className="p-2 sm:p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg sm:rounded-xl transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Restore"
                                >
                                    <ArrowPathIcon className="h-5 w-5 text-green-600" />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onPermanentDelete?.(item); }}
                                    className="p-2 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg sm:rounded-xl transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Delete permanently"
                                >
                                    <TrashIcon className="h-5 w-5 text-red-600" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStar?.(item); }}
                                    className="p-2 sm:p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg sm:rounded-xl transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title={item.is_starred ? 'Unstar' : 'Star'}
                                >
                                    {item.is_starred ? (
                                        <StarSolid className="h-5 w-5 text-yellow-500" />
                                    ) : (
                                        <StarOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    )}
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onTrash?.(item); }}
                                    className="p-2 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg sm:rounded-xl transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Move to trash"
                                >
                                    <TrashIcon className="h-5 w-5 text-red-500" />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onRename?.(item); }}
                                    className="p-2 sm:p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg sm:rounded-xl transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Rename"
                                >
                                    <PencilIcon className="h-5 w-5 text-blue-600" />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); onDownload?.(item); }}
                                    className="p-2 sm:p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg sm:rounded-xl transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                    title="Download"
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5 text-indigo-600" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Grid view floating actions */}
            {isGrid && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onStar?.(item); }}
                        className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                        {item.is_starred ? (
                            <StarSolid className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                        ) : (
                            <StarOutline className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                        )}
                    </button>

                    {isTrash && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRestore?.(item); }}
                                className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                            >
                                <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); onPermanentDelete?.(item); }}
                                className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                            >
                                <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}