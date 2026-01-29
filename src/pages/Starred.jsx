// pages/Starred.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileItem from '../components/FileItem';
import RenameModal from '../components/RenameModal';

export default function Starred() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renameItem, setRenameItem] = useState(null);

    useEffect(() => {
        loadStarred();
    }, [currentFolderId]);

    const loadStarred = async () => {
        try {
            setLoading(true);
            let url = '/files/starred';
            if (currentFolderId) {
                url += `?folderId=${currentFolderId}`;
            }
            const res = await api.get(url);
            const data = res.data.data || [];
            setItems(data);
            setFilteredItems(data);
        } catch (err) {
            console.error('Error loading starred:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredItems(items);
            return;
        }
        const q = query.toLowerCase();
        const filtered = items.filter(item => item.name.toLowerCase().includes(q));
        setFilteredItems(filtered);
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
            const endpoint = item.type === 'folder'
                ? `/folders/${item.id}/star`
                : `/files/${item.id}/star`;
            await api.patch(endpoint);
            loadStarred();
        } catch (err) {
            console.error('Star toggle failed:', err);
        }
    };

    const handleTrash = async (item) => {
        try {
            const endpoint = item.type === 'folder'
                ? `/folders/${item.id}/trash`
                : `/files/${item.id}/trash`;
            await api.patch(endpoint);
            loadStarred();
        } catch (err) {
            console.error('Trash failed:', err);
        }
    };

    const handleRenameOpen = (item) => {
        setRenameItem(item);
    };

    const handleDownload = async (item) => {
        try {
            const endpoint = item.type === 'folder'
                ? `/files/folder/${item.id}/zip`
                : `/files/${item.id}/download`;
            const res = await api.get(endpoint);
            window.open(res.data.url, '_blank');
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header onSearch={handleSearch} />

                <main className="flex-1 p-6 overflow-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Starred {currentFolderId ? '→ Inside Folder' : ''}
                        </h1>
                        {currentFolderId && (
                            <button
                                onClick={handleBack}
                                className="
                                    px-4 py-2 rounded-lg
                                    bg-gray-200 dark:bg-gray-700
                                    hover:bg-gray-300 dark:hover:bg-gray-600
                                    text-gray-800 dark:text-gray-200
                                    transition
                                "
                            >
                                ← Back to Starred
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                            {currentFolderId ? 'No starred items in this folder' : 'No starred items'}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredItems.map((item) => (
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
                    onSuccess={loadStarred}
                />
            )}
        </div>
    );
}