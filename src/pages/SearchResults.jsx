import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileItem from '../components/FileItem';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }
        const search = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/files/search?q=${encodeURIComponent(query)}`);
                setResults(res.data.data || []);
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setLoading(false);
            }
        };
        search();
    }, [query]);

    const handleSearch = (newQuery) => {
        if (newQuery.trim() && newQuery !== query) {
            navigate(`/search?q=${encodeURIComponent(newQuery.trim())}`);
        }
    };

    const handleStar = async (item) => {
        try {
            const endpoint = item.type === 'folder'
                ? `/folders/${item.id}/star`
                : `/files/${item.id}/star`;
            await api.patch(endpoint);
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
            const res = await api.get(`/files/search?q=${encodeURIComponent(query)}`);
            setResults(res.data.data || []);
        } catch (err) {
            console.error('Trash failed:', err);
        }
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
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header onSearch={handleSearch} />

                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    <h1 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
                        Search results for "{query}"
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        {results.length} {results.length === 1 ? 'item' : 'items'} found
                    </p>

                    {loading ? (
                        <div className="flex justify-center items-center h-48 sm:h-64">
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-16 sm:py-20 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {results.map((item) => (
                                <FileItem
                                    key={item.id}
                                    item={item}
                                    onStar={() => handleStar(item)}
                                    onTrash={() => handleTrash(item)}
                                    onDownload={() => handleDownload(item)}
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
