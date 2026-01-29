// CreateFolderWithFilesModal.jsx
import React, { useState } from 'react';
import api from '../services/api';

export default function CreateFolderWithFilesModal({ onClose, parentId, onSuccess }) {
    const [name, setName] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFilesChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleDrop = (droppedFiles) => {
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    const handleCreate = async () => {
        if (!name.trim()) return alert("Folder name required");

        setLoading(true);

        try {
            // 1. Create folder
            const folderRes = await api.post('/folders', { name: name.trim(), parentId });
            const newFolderId = folderRes.data.data.id;

            // 2. Upload files into it (if any)
            if (files.length > 0) {
                const formData = new FormData();
                files.forEach(file => formData.append('files', file));
                formData.append('folderId', newFolderId);

                await api.post('/files/upload-folder', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error creating folder or uploading files");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">New folder with files</h2>

                <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Folder name"
                    className="w-full p-3 border rounded mb-4 dark:bg-slate-800"
                />

                <div className="border-2 border-dashed p-6 mb-4 rounded-lg text-center">
                    <p>Drag files here or click to select</p>
                    <input
                        type="file"
                        multiple
                        onChange={handleFilesChange}
                        className="hidden"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer text-blue-600">
                        Choose files
                    </label>
                    {files.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                            {files.length} file(s) selected
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2">Cancel</button>
                    <button
                        onClick={handleCreate}
                        disabled={loading || !name.trim()}
                        className="px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create & Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}