// components/RenameModal.jsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function RenameModal({ item, onClose, onSuccess }) {
    const [name, setName] = useState(item.name || '');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRename = async () => {
        const trimmed = name.trim();

        if (!trimmed) {
            setError('Name cannot be empty');
            return;
        }

        if (trimmed === item.name) {
            onClose();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const endpoint = item.type === 'folder'
                ? `/folders/${item.id}/rename`
                : `/files/${item.id}/rename`;

            await api.patch(endpoint, { name: trimmed });
            onSuccess?.(); // Refresh parent
            onClose();
        } catch (err) {
            console.error('Rename error:', err);
            setError(err.response?.data?.message || 'Failed to rename');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md mx-auto flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700 animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                        ✏️ Rename {item.type}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm text-center sm:text-left border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="Enter new name"
                        autoFocus
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                    />
                </div>

                {/* Footer */}
                <div className="p-5 sm:p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium disabled:opacity-50 w-full sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleRename}
                        disabled={loading || !name.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center font-medium w-full sm:w-auto"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        )}
                        {loading ? 'Renaming...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
