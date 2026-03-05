// pages/Trash.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileItem from '../components/FileItem';

export default function Trash() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadTrash();
    }, [currentFolderId]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredItems(items);
        } else {
            const filtered = items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    }, [searchQuery, items]);

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
            setFilteredItems(res.data.data || []);
        } catch (err) {
            console.error('Error loading trash:', err);
            setError('Failed to load trash items');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
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

    const handleStar = async (item) => {
        try {
            const endpoint =
                item.type === 'folder'
                    ? `/folders/${item.id}/star`
                    : `/files/${item.id}/star`;
            await api.patch(endpoint);
            loadTrash();
        } catch (err) {
            console.error('Star toggle failed:', err);
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
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-h-0">
                <Header
                    onSearch={handleSearch}
                    onToggleSidebar={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                Trash {currentFolderId ? '→ Folder' : ''}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {currentFolderId ? 'Trashed items in this folder' : 'Items in trash will be deleted after 30 days'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {currentFolderId && (
                                <button
                                    onClick={handleBack}
                                    className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 transition-all shadow-sm hover:shadow touch-manipulation"
                                >
                                    ← Back to Trash
                                </button>
                            )}

                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl flex items-center gap-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm touch-manipulation"
                            >
                                {viewMode === 'grid' ? 'List' : 'Grid'}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-gray-500 dark:text-gray-400">Loading trash...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 mb-6">
                                <svg className="w-12 h-12 sm:w-14 sm:h-14 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    ) : filteredItems.length === 0 && searchQuery ? (
                        <div className="text-center py-20 sm:py-32">
                            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30 mb-6">
                                <svg className="w-12 h-12 sm:w-14 sm:h-14 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No results found
                            </p>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Try a different search term</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 sm:py-32">
                            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30 mb-6">
                                <svg className="w-12 h-12 sm:w-14 sm:h-14 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <p className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {currentFolderId ? 'No trashed items in this folder' : 'Trash is empty'}
                            </p>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Deleted items will appear here</p>
                        </div>
                    ) : (
                        <div
                            className={
                                viewMode === 'grid'
                                    ? 'grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                                    : 'space-y-2 max-w-full overflow-hidden'
                            }
                        >
                            {filteredItems.map((item) => (
                                <FileItem
                                    key={item.id}
                                    item={item}
                                    onClick={() => handleItemClick(item)}
                                    onStar={() => handleStar(item)}
                                    onRestore={() => handleRestore(item)}
                                    onPermanentDelete={() => handlePermanentDelete(item)}
                                    isTrash={true}
                                    isGrid={viewMode === 'grid'}
                                />
                            ))}
                        </div>
                    )}
                </main>
                <footer className="border-t border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                    © {new Date().getFullYear()} <span className="font-semibold text-gray-700 dark:text-gray-300">AK Drive</span>
                </footer>
            </div>
        </div>
    );
}