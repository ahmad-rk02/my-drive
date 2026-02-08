// pages/Trash.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileItem from '../components/FileItem';

export default function Trash() {
    const [items, setItems] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTrash();
    }, [currentFolderId]);

    const loadTrash = async () => {
        try {
            setLoading(true);
            setError(null);
            let url = '/files/trashed';
            if (currentFolderId) {
                url += `?folderId=${currentFolderId}`;
            }
            const res = await api.get(url);
            console.log('Trashed items:', res.data);
            setItems(res.data.data || []);
        } catch (err) {
            console.error('Error loading trash:', err);
            setError('Failed to load trash items');
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

    const handleRestore = async (item) => {
        try {
            const endpoint =
                item.type === 'folder'
                    ? `/folders/${item.id}/restore`
                    : `/files/${item.id}/restore`;
            await api.patch(endpoint);
            loadTrash();
        } catch (err) {
            alert('Restore failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handlePermanentDelete = async (item) => {
        if (!window.confirm('Permanently delete? This cannot be undone.')) return;
        try {
            const endpoint =
                item.type === 'folder'
                    ? `/folders/${item.id}/permanent`
                    : `/files/${item.id}/permanent`;
            await api.delete(endpoint);
            loadTrash();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-0">
                <Header onSearch={() => { }} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6">
                    {/* Header with title + back button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
                            Trash {currentFolderId ? '→ Inside Folder' : ''}
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
                                ← Back to Trash
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[50vh]">
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 dark:text-red-400 py-10 text-sm sm:text-base">
                            {error}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16 sm:py-24 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            {currentFolderId ? 'This folder has no trashed items' : 'Trash is empty'}
                        </div>
                    ) : (
                        <div className="space-y-2.5 sm:space-y-2">
                            {items.map((item) => (
                                <FileItem
                                    key={item.id}
                                    item={item}
                                    onClick={() => handleItemClick(item)}
                                    onRestore={handleRestore}
                                    onPermanentDelete={handlePermanentDelete}
                                    isTrash={true}
                                    isGrid={false}
                                />
                            ))}
                        </div>
                    )}
                </main>
                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center text-sm text-gray-500 dark:text-gray-400 py-3">
                    © {new Date().getFullYear()} <span className="font-medium text-gray-700 dark:text-gray-300">Ak Drive</span>. All rights reserved.
                </footer>
            </div>
            
        </div>
    );
}