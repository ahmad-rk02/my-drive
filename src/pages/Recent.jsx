// pages/Recent.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileItem from '../components/FileItem';
import RenameModal from '../components/RenameModal';

export default function Recent() {
    const [items, setItems] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renameItem, setRenameItem] = useState(null);

    useEffect(() => {
        loadRecent();
    }, [currentFolderId]);

    const loadRecent = async () => {
        try {
            setLoading(true);
            let url = '/files/recent';
            if (currentFolderId) {
                url += `?folderId=${currentFolderId}`;
            }
            const res = await api.get(url);
            setItems(res.data.data || []);
        } catch (err) {
            console.error('Error loading recent:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item) => {
        if (item.type === 'folder') {
            setCurrentFolderId(item.id);
        }
    };

    const handleBack = () => {
        setCurrentFolderId(null);
    };

    const handleStar = async (item) => {
        try {
            const endpoint =
                item.type === 'folder'
                    ? `/folders/${item.id}/star`
                    : `/files/${item.id}/star`;
            await api.patch(endpoint);
            loadRecent();
        } catch (err) {
            console.error('Star toggle failed:', err);
        }
    };

    const handleTrash = async (item) => {
        try {
            const endpoint =
                item.type === 'folder'
                    ? `/folders/${item.id}/trash`
                    : `/files/${item.id}/trash`;
            await api.patch(endpoint);
            loadRecent();
        } catch (err) {
            console.error('Trash failed:', err);
        }
    };

    const handleRenameOpen = (item) => {
        setRenameItem(item);
    };

    const handleDownload = async (item) => {
        try {
            const endpoint =
                item.type === 'folder'
                    ? `/files/folder/${item.id}/zip`
                    : `/files/${item.id}/download`;
            const res = await api.get(endpoint);
            window.open(res.data.url, '_blank');
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-0">
                <Header onSearch={() => { }} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6">
                    {/* Header section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5">
                        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
                            Recent {currentFolderId ? '→ Inside Folder' : ''}
                        </h1>

                        {currentFolderId && (
                            <button
                                onClick={handleBack}
                                className="
                  px-4 py-2 text-sm sm:text-base font-medium
                  rounded-lg
                  bg-gray-200 dark:bg-gray-700
                  hover:bg-gray-300 dark:hover:bg-gray-600
                  text-gray-800 dark:text-gray-200
                  transition-colors
                  w-full sm:w-auto
                  min-h-[44px] flex items-center justify-center
                "
                            >
                                ← Back to Recent
                            </button>
                        )}
                    </div>

                    {/* Loading state */}
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[50vh]">
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16 sm:py-24 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            {currentFolderId
                                ? 'This folder has no recent activity'
                                : 'No recent activity'}
                        </div>
                    ) : (
                        <div className="space-y-2.5 sm:space-y-2">
                            {items.map((item) => (
                                <FileItem
                                    key={item.id}
                                    item={item}
                                    onClick={() => handleItemClick(item)}
                                    onStar={() => handleStar(item)}
                                    onTrash={() => handleTrash(item)}
                                    onRename={handleRenameOpen}
                                    onDownload={() => handleDownload(item)}
                                    isGrid={false}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {renameItem && (
                <RenameModal
                    item={renameItem}
                    onClose={() => setRenameItem(null)}
                    onSuccess={loadRecent}
                />
            )}
        </div>
    );
}