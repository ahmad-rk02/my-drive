import React, { useEffect, useState } from "react";
import api from "../services/api";

const StorageBar = () => {
    const [usage, setUsage] = useState(0);
    const total = 15 * 1024 * 1024 * 1024; // 15GB

    useEffect(() => {
        api.get("/stats/usage").then((res) => setUsage(res.data.bytes));
    }, []);

    const percent = Math.min((usage / total) * 100, 100);

    return (
        <div className="mt-8 p-3 rounded-lg bg-gray-50 dark:bg-darkCard w-full max-w-xs">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Storage used
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {(usage / (1024 * 1024)).toFixed(2)} MB of 15 GB
            </p>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default StorageBar;
