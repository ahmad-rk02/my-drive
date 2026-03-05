import React, { useEffect, useState } from "react";
import api from "../services/api";

const StorageBar = () => {
    const [usage, setUsage] = useState(0);
    const total = 15 * 1024 * 1024 * 1024; // 15GB

    useEffect(() => {
        api.get("/stats/usage").then((res) => setUsage(res.data.bytes));
    }, []);

    const percent = Math.min((usage / total) * 100, 100);
    const usedMB = (usage / (1024 * 1024)).toFixed(2);
    const usedGB = (usage / (1024 * 1024 * 1024)).toFixed(2);

    return (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Storage
                </p>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {percent.toFixed(1)}%
                </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {usedGB < 1 ? `${usedMB} MB` : `${usedGB} GB`} of 15 GB used
            </p>

            <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default StorageBar;
