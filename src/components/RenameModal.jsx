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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                        Rename {item.type}
                    </h2>
                    <button onClick={onClose} disabled={loading}>
                        <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm text-center sm:text-left">
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition"
                    />
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end sm:space-x-3 gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 w-full sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleRename}
                        disabled={loading || !name.trim()}
                        className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center w-full sm:w-auto"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        )}
                        {loading ? 'Renaming...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
