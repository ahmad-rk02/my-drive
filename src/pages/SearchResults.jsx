import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FileItem from '../components/FileItem';
import SimpleFooter from '../components/SimpleFooter';

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
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-0">
                <Header onSearch={handleSearch} />

                <main className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                Search Results
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Showing results for <span className="font-semibold text-blue-600 dark:text-blue-400">"{query}"</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                {results.length} {results.length === 1 ? 'item' : 'items'} found
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="text-gray-500 dark:text-gray-400">Searching...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-20 sm:py-32">
                            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-6">
                                <svg className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No results found
                            </p>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                Try searching with different keywords
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
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

                <SimpleFooter />
            </div>
        </div>
    );
}
