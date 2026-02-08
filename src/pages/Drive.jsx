// pages/Drive.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileItem from '../components/FileItem';
import UploadModal from '../components/UploadModal';
import CreateFolderWithFilesModal from '../components/CreateFolderWithFilesModal';
import RenameModal from '../components/RenameModal';
import DropZone from '../components/DropZone';

export default function Drive() {
    const [items, setItems] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showUpload, setShowUpload] = useState(false);
    const [showCreateFolderWithFiles, setShowCreateFolderWithFiles] = useState(false);
    const [renameItem, setRenameItem] = useState(null);

    const [viewMode, setViewMode] = useState('grid');

    // 🔑 NEW: sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    /* LOAD FILES */
    useEffect(() => {
        loadItems();
    }, [currentFolderId]);

    const loadItems = async () => {
        try {
            setLoading(true);
            let url = '/files';
            if (currentFolderId) {
                url += `?folderId=${currentFolderId}`;
            }
            const res = await api.get(url);
            setItems(res.data.data || []);
        } catch (err) {
            console.error('Error loading items:', err);
        } finally {
            setLoading(false);
        }
    };

    /* ACTIONS */
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
            loadItems();
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
            loadItems();
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

    const handleSearch = (query) => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleDrop = async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const formData = new FormData();
        acceptedFiles.forEach(file => formData.append('files', file));

        try {
            await api.post('/files/upload-folder', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            loadItems();
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

            {/* SIDEBAR */}
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            {/* MAIN COLUMN */}
            <div className="flex-1 flex flex-col min-h-0">

                {/* HEADER */}
                <Header
                    onSearch={handleSearch}
                    onToggleSidebar={() => setSidebarOpen(true)}
                />

                {/* CONTENT */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
                            {currentFolderId ? 'Folder' : 'My Drive'}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {currentFolderId && (
                                <button
                                    onClick={handleBack}
                                    className="
                                        px-4 py-2 text-sm font-medium
                                        rounded-lg
                                        bg-gray-200 dark:bg-gray-700
                                        hover:bg-gray-300 dark:hover:bg-gray-600
                                        text-gray-800 dark:text-gray-200
                                        transition
                                        min-h-[44px]
                                    "
                                >
                                    ← Back
                                </button>
                            )}

                            <button
                                onClick={() => setShowUpload(true)}
                                className="
                                    px-4 py-2 text-sm font-medium
                                    rounded-lg bg-blue-600 text-white
                                    hover:bg-blue-700
                                    transition
                                    min-h-[44px]
                                "
                            >
                                Upload
                            </button>

                            <button
                                onClick={() => setShowCreateFolderWithFiles(true)}
                                className="
                                    px-4 py-2 text-sm font-medium
                                    rounded-lg bg-indigo-600 text-white
                                    hover:bg-indigo-700
                                    transition
                                    min-h-[44px]
                                "
                            >
                                New folder with files…
                            </button>

                            {/* VIEW TOGGLE */}
                            <button
                                onClick={() =>
                                    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                                }
                                className="
                                    px-4 py-2 text-sm font-medium
                                    rounded-lg flex items-center gap-2
                                    border border-gray-300 dark:border-gray-700
                                    bg-white dark:bg-gray-900
                                    text-gray-800 dark:text-gray-200
                                    hover:bg-gray-100 dark:hover:bg-gray-800
                                    transition
                                    min-h-[44px]
                                "
                            >
                                {viewMode === 'grid' ? '📄 List' : '🔲 Grid'}
                            </button>
                        </div>
                    </div>

                    {/* FILES */}
                    <DropZone onDrop={handleDrop}>
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[50vh]">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                                <p className="font-medium mb-1">This folder is empty</p>
                                <p>Upload files or create a folder</p>
                            </div>
                        ) : (
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                                        : 'space-y-2'
                                }
                            >
                                {items.map(item => (
                                    <FileItem
                                        key={item.id}
                                        item={item}
                                        onClick={() => handleItemClick(item)}
                                        onStar={() => handleStar(item)}
                                        onTrash={() => handleTrash(item)}
                                        onRename={handleRenameOpen}
                                        onDownload={() => handleDownload(item)}
                                        isGrid={viewMode === 'grid'}
                                    />
                                ))}
                            </div>
                        )}
                    </DropZone>
                </main>

                {/* FOOTER */}
                <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center text-sm text-gray-500 dark:text-gray-400 py-3">
                    © {new Date().getFullYear()} <span className="font-medium">Ak Drive</span>
                </footer>
            </div>

            {/* MODALS */}
            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    folderId={currentFolderId}
                    onSuccess={loadItems}
                />
            )}

            {showCreateFolderWithFiles && (
                <CreateFolderWithFilesModal
                    onClose={() => setShowCreateFolderWithFiles(false)}
                    parentId={currentFolderId}
                    onSuccess={loadItems}
                />
            )}

            {renameItem && (
                <RenameModal
                    item={renameItem}
                    onClose={() => setRenameItem(null)}
                    onSuccess={loadItems}
                />
            )}
        </div>
    );
}
