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
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 overflow-hidden">

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
                <main className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                {currentFolderId ? 'Folder' : 'My Drive'}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {currentFolderId ? 'Browse folder contents' : 'Your personal cloud storage'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {currentFolderId && (
                                <button
                                    onClick={handleBack}
                                    className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 transition-all shadow-sm hover:shadow touch-manipulation"
                                >
                                    ← Back
                                </button>
                            )}

                            <button
                                onClick={() => setShowUpload(true)}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all touch-manipulation"
                            >
                                Upload
                            </button>

                            <button
                                onClick={() => setShowCreateFolderWithFiles(true)}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all touch-manipulation"
                            >
                                New Folder
                            </button>

                            {/* VIEW TOGGLE */}
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl flex items-center gap-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm touch-manipulation"
                            >
                                {viewMode === 'grid' ? 'List' : 'Grid'}
                            </button>
                        </div>
                    </div>

                    {/* FILES */}
                    <DropZone onDrop={handleDrop}>
                        {loading ? (
                            <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                                <p className="text-gray-500 dark:text-gray-400">Loading your files...</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-20 sm:py-32">
                                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-6">
                                    <svg className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">This folder is empty</p>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Upload files or create a folder to get started</p>
                            </div>
                        ) : (
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                                        : 'space-y-2 max-w-full overflow-hidden'
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
                <footer className="border-t border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                    © {new Date().getFullYear()} <span className="font-semibold text-gray-700 dark:text-gray-300">AK Drive</span>
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
