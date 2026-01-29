import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const DarkModeToggle = () => {
    useEffect(() => {
        if (localStorage.theme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.theme = isDark ? "dark" : "light";
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            <SunIcon className="h-5 w-5 text-gray-800 dark:hidden" />
            <MoonIcon className="h-5 w-5 text-gray-200 hidden dark:block" />
        </button>
    );
};

export default DarkModeToggle;
