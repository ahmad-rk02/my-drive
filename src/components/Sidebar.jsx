import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ClockIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import StorageBar from "./StorageBar";

const Sidebar = ({ open, setOpen }) => {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
     ${pathname === path
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
    }`;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 sm:w-72
          bg-white dark:bg-slate-900
          border-r border-gray-200 dark:border-slate-800
          px-4 py-6
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none
          flex flex-col
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-6 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 self-end transition-colors"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>

        <nav className="space-y-2 flex-1">
          <Link to="/drive" className={linkClass("/drive")} onClick={() => setOpen(false)}>
            <HomeIcon className="h-5 w-5" /> My Drive
          </Link>

          <Link to="/recent" className={linkClass("/recent")} onClick={() => setOpen(false)}>
            <ClockIcon className="h-5 w-5" /> Recent
          </Link>

          <Link to="/starred" className={linkClass("/starred")} onClick={() => setOpen(false)}>
            <StarIcon className="h-5 w-5" /> Starred
          </Link>

          <Link to="/trash" className={linkClass("/trash")} onClick={() => setOpen(false)}>
            <TrashIcon className="h-5 w-5" /> Trash
          </Link>
        </nav>

        <div className="my-6 border-t border-gray-200 dark:border-slate-800" />

        <StorageBar />
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;