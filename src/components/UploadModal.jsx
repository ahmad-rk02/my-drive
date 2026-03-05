// components/UploadModal.jsx
import React, { useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import api from "../services/api";

export default function UploadModal({ onClose, folderId, onSuccess }) {
    const [uploading, setUploading] = useState(false);
    const folderInputRef = useRef(null);

    /* ================= FILE UPLOAD (Dropzone) ================= */
    const handleFileUpload = async (acceptedFiles) => {
        if (!acceptedFiles.length) return;

        const formData = new FormData();
        acceptedFiles.forEach((file) => formData.append("files", file));
        if (folderId) formData.append("folderId", folderId);

        try {
            setUploading(true);
            await api.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileUpload,
        multiple: true,
    });

    /* ================= FOLDER UPLOAD (Native Input) ================= */
    const handleFolderUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const formData = new FormData();
        files.forEach((file) => {
            // browser automatically sets webkitRelativePath
            formData.append("files", file);
        });
        if (folderId) formData.append("folderId", folderId);

        try {
            setUploading(true);
            await api.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setUploading(false);
            e.target.value = ""; // reset input
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-slate-700 animate-scale-in">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">📤 Upload to Drive</h2>
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6">

                    {/* FILE DROPZONE */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
                                : "border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <span className="text-3xl">📁</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isDragActive ? "Drop files here" : "Drag & drop files"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                or click to browse your computer
                            </p>
                        </div>
                    </div>

                    {/* OR */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-medium">OR</span>
                        </div>
                    </div>

                    {/* FOLDER UPLOAD BUTTON */}
                    <div className="flex justify-center">
                        <button
                            disabled={uploading}
                            onClick={() => folderInputRef.current.click()}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            📂 Upload Entire Folder
                        </button>
                    </div>

                    {/* Hidden Folder Input */}
                    <input
                        ref={folderInputRef}
                        type="file"
                        webkitdirectory=""
                        directory=""
                        multiple
                        hidden
                        onChange={handleFolderUpload}
                    />

                    {/* Uploading State */}
                    {uploading && (
                        <div className="flex flex-col items-center gap-3 mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Uploading your files...</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">Please wait, this may take a moment</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
