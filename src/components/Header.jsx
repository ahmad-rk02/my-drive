// Header.jsx
import { useEffect, useState } from 'react';
import {
    MagnifyingGlassIcon,
    ArrowRightOnRectangleIcon,
    PencilSquareIcon,
    Bars3Icon,
    CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '../supabase';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ onSearch, onToggleSidebar }) => {
    const [query, setQuery] = useState('');
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [updateType, setUpdateType] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setUser(data.user);
                setEmail(data.user.email);
            }
        });

        // Close menu when clicking outside
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.profile-menu-container')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(query);
        }
    };

    const handleQueryChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (onSearch) {
            onSearch(newQuery);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        setMessage('');
        try {
            if (updateType === 'email') {
                const { error } = await supabase.auth.updateUser({ email });
                if (error) throw error;
                setMessage('Verification link sent to new email');
            }
            if (updateType === 'password') {
                if (!password) throw new Error('Password cannot be empty');
                const { error } = await supabase.auth.updateUser({ password });
                if (error) throw error;
                setMessage('Password updated successfully');
                setPassword('');
            }
        } catch (err) {
            setMessage(err.message || 'Something went wrong');
        }
        setLoading(false);
    };

    const firstLetter = user?.email?.charAt(0).toUpperCase() || '?';

    return (
        <>
            <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 sticky top-0 z-20">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Hamburger menu – only visible on mobile */}
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden p-2 -ml-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </button>

                    <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.location.href = '/drive'}
                    >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                            <CloudArrowUpIcon className="h-5 w-5 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            AK Drive
                        </span>
                    </div>

                    <div className="relative hidden sm:block">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Drive"
                            className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 w-64 lg:w-80 transition-all"
                            value={query}
                            onChange={handleQueryChange}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <DarkModeToggle />

                    <div className="relative profile-menu-container">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="h-10 w-10 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-lg hover:ring-4 hover:ring-blue-400/30 transition-all shadow-md hover:shadow-lg touch-manipulation"
                        >
                            {firstLetter}
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-64 sm:w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] divide-y divide-gray-200 dark:divide-slate-700 overflow-hidden animate-scale-in">
                                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {user?.email || 'Not signed in'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        Signed in
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setProfileOpen(true);
                                        setMenuOpen(false);
                                        setMessage('');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors touch-manipulation"
                                >
                                    <PencilSquareIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Update profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors touch-manipulation"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Update Profile Modal */}
            {profileOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 animate-scale-in">
                        <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center text-gray-900 dark:text-white">
                            Update Profile
                        </h2>

                        {message && (
                            <p className={`text-sm mb-4 text-center p-3 rounded-xl border ${message.includes('success') ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
                                {message}
                            </p>
                        )}

                        <div className="flex gap-4 justify-center mb-5 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={updateType === 'email'}
                                    onChange={() => setUpdateType('email')}
                                    className="accent-blue-600 w-4 h-4"
                                />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Email</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={updateType === 'password'}
                                    onChange={() => setUpdateType('password')}
                                    className="accent-blue-600 w-4 h-4"
                                />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Password</span>
                            </label>
                        </div>

                        {updateType === 'email' && (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="New email address"
                            />
                        )}

                        {updateType === 'password' && (
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="New password"
                            />
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setProfileOpen(false)}
                                className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;