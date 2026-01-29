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

    const navigate = useNavigate();

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
            const receivedItems = res.data.data || [];
            console.log(`Loaded ${receivedItems.length} items in folder ${currentFolderId || 'root'}`);
            setItems(receivedItems);
        } catch (err) {
            console.error('Error loading items:', err);
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
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-0">
                <Header onSearch={handleSearch} />

                <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6">
                    {/* Header with title + back button + actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">
                            {currentFolderId ? 'Folder' : 'My Drive'}
                        </h1>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
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
                    min-h-[44px] flex items-center justify-center
                  "
                                >
                                    ← Back to My Drive
                                </button>
                            )}

                            <button
                                onClick={() => setShowUpload(true)}
                                className="
                  px-4 py-2 text-sm sm:text-base font-medium
                  rounded-lg bg-blue-600 text-white
                  hover:bg-blue-700
                  transition shadow-sm
                  min-h-[44px]
                "
                            >
                                Upload
                            </button>

                            <button
                                onClick={() => setShowCreateFolderWithFiles(true)}
                                className="
                  px-4 py-2 text-sm sm:text-base font-medium
                  rounded-lg bg-indigo-600 text-white
                  hover:bg-indigo-700
                  transition shadow-sm
                  min-h-[44px]
                "
                            >
                                New folder with files…
                            </button>

                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="
                  px-3 py-2 text-sm
                  rounded-lg
                  border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition
                  min-h-[44px]
                "
                            >
                                {viewMode === 'grid' ? 'List' : 'Grid'}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <DropZone onDrop={handleDrop}>
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[50vh]">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-16 sm:py-24 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                <p className="font-medium mb-2">
                                    This folder is empty
                                </p>
                                <p>
                                    Upload files or create a folder
                                </p>
                            </div>
                        ) : (
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                                        : 'space-y-2.5 sm:space-y-2'
                                }
                            >
                                {items.map((item) => (
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
            </div>

            {/* Modals */}
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