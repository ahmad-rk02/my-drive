import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ClockIcon,
  StarIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import StorageBar from "./StorageBar";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition
     ${pathname === path
        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`;

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 
          bg-white dark:bg-[#020617] border-r border-gray-200 dark:border-gray-800
          px-4 py-6 w-64 transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >
        <nav className="space-y-2">
          <Link to="/drive" className={linkClass("/drive")} onClick={() => setOpen(false)}>
            <HomeIcon className="h-5 w-5" />
            <span className="font-medium">My Drive</span>
          </Link>

          <Link to="/recent" className={linkClass("/recent")} onClick={() => setOpen(false)}>
            <ClockIcon className="h-5 w-5" />
            <span className="font-medium">Recent</span>
          </Link>

          <Link to="/starred" className={linkClass("/starred")} onClick={() => setOpen(false)}>
            <StarIcon className="h-5 w-5" />
            <span className="font-medium">Starred</span>
          </Link>

          <Link to="/trash" className={linkClass("/trash")} onClick={() => setOpen(false)}>
            <TrashIcon className="h-5 w-5" />
            <span className="font-medium">Trash</span>
          </Link>
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

        {/* Storage */}
        <StorageBar />
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
