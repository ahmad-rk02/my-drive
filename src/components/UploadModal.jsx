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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="bg-white dark:bg-[#020617] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-white/10">
                    <h2 className="text-lg font-semibold">Upload to Drive</h2>
                    <button onClick={onClose} disabled={uploading}>
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">

                    {/* FILE DROPZONE */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
              ${isDragActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-blue-400"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <p className="text-lg font-medium">
                            {isDragActive ? "Drop files here" : "Drag & drop files"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            or click to browse files
                        </p>
                    </div>

                    {/* OR */}
                    <div className="text-center text-gray-400 font-medium">OR</div>

                    {/* FOLDER UPLOAD BUTTON */}
                    <div className="flex justify-center">
                        <button
                            disabled={uploading}
                            onClick={() => folderInputRef.current.click()}
                            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            Upload Folder
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
                        <div className="flex flex-col items-center gap-2 mt-4">
                            <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">Uploading… please wait</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t dark:border-white/10">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-[#0f172a] hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
