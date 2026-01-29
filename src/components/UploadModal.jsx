// components/UploadModal.jsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';

export default function UploadModal({ onClose, folderId, onSuccess }) {
    const [uploadType, setUploadType] = useState('files');
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (acceptedFiles) => {
        if (!acceptedFiles.length) return;

        setUploading(true);
        const formData = new FormData();
        acceptedFiles.forEach((file) => formData.append('files', file));
        if (folderId) formData.append('folderId', folderId);

        try {
            await api.post('/files/upload', formData);
            onSuccess?.();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleUpload,
        multiple: true,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-[#020617] rounded-2xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                        Upload to Drive
                    </h2>
                    <button onClick={onClose} className="icon-btn" disabled={uploading}>
                        <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex text-sm sm:text-base">
                    {['files', 'folder'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setUploadType(type)}
                            className={`
                                flex-1 py-3 sm:py-4 font-medium transition
                                ${uploadType === type
                                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-500/5'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }
                            `}
                        >
                            {type === 'files' ? 'Files' : 'Folder'}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="p-6 sm:p-10 flex flex-col items-center gap-4">
                    <div
                        {...getRootProps()}
                        className={`
                            w-full rounded-2xl border-2 border-dashed
                            p-8 sm:p-16 text-center cursor-pointer
                            transition-all duration-200
                            ${isDragActive
                                ? 'border-blue-500 bg-blue-500/10 scale-105'
                                : 'border-gray-300 dark:border-white/15 hover:border-blue-500/70 hover:bg-blue-500/5'
                            }
                        `}
                    >
                        <input
                            {...getInputProps()}
                            {...(uploadType === 'folder' ? { webkitdirectory: '', directory: '' } : {})}
                            multiple
                        />

                        <p className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                            {isDragActive
                                ? 'Drop files here'
                                : uploadType === 'folder'
                                    ? 'Drag & drop a folder'
                                    : 'Drag & drop files'}
                        </p>

                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            or <span className="text-blue-500 font-medium">click to browse</span>
                        </p>

                        {uploadType === 'folder' && (
                            <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-400">
                                Folder structure preserved (Chrome / Edge)
                            </p>
                        )}
                    </div>

                    {uploading && (
                        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-2 sm:gap-3">
                            <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                Uploading… please wait
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-end px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-white/10 gap-2 sm:gap-3">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="px-6 py-2 rounded-lg w-full sm:w-auto bg-gray-100 dark:bg-[#0f172a] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#1e293b] transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
