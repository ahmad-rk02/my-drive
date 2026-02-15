// Header.jsx
import { useEffect, useState } from 'react';
import {
    MagnifyingGlassIcon,
    ArrowRightOnRectangleIcon,
    PencilSquareIcon,
    Bars3Icon,           // ← added hamburger icon
} from '@heroicons/react/24/outline';
import { supabase } from '../supabase';
import DarkModeToggle from './DarkModeToggle';
import logo from '../assets/Ayarn.jpg';

const Header = ({ onSearch, onToggleSidebar }) => {   // ← receive the prop
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
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(query);
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
            <header className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 flex items-center justify-between gap-4">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">

                    {/* Hamburger menu – only visible on mobile */}
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle sidebar"
                    >
                        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </button>

                    <img
                        src={logo}
                        alt="Drive Logo"
                        className="h-8 cursor-pointer"
                        onClick={() => window.location.href = '/drive'}
                    />

                    <div className="relative hidden sm:block">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Drive"
                            className="
                pl-10 pr-4 py-2 rounded-full
                bg-gray-100 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                outline-none w-72
              "
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3">
                    <DarkModeToggle />

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="
                h-9 w-9 rounded-full
                bg-blue-600 text-white
                flex items-center justify-center
                font-semibold text-lg
                hover:ring-2 hover:ring-blue-400 transition
              "
                        >
                            {firstLetter}
                        </button>

                        {menuOpen && (
                            <div className="
                absolute right-0 mt-2 w-56
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-lg shadow-xl z-50 divide-y divide-gray-200 dark:divide-gray-700
              ">
                                <div className="px-4 py-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {user?.email || 'Not signed in'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Signed in
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setProfileOpen(true);
                                        setMenuOpen(false);
                                        setMessage('');
                                    }}
                                    className="
                    w-full flex items-center gap-3 px-4 py-2.5 text-sm
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  "
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                    Update profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="
                    w-full flex items-center gap-3 px-4 py-2.5 text-sm
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  "
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Update Profile Modal */}
            {profileOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-semibold mb-5 text-center text-gray-900 dark:text-white">
                            Update Profile
                        </h2>

                        {message && (
                            <p className={`text-sm mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-blue-600'}`}>
                                {message}
                            </p>
                        )}

                        <div className="flex gap-6 justify-center mb-5 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={updateType === 'email'}
                                    onChange={() => setUpdateType('email')}
                                    className="accent-blue-600"
                                />
                                Email
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={updateType === 'password'}
                                    onChange={() => setUpdateType('password')}
                                    className="accent-blue-600"
                                />
                                Password
                            </label>
                        </div>

                        {updateType === 'email' && (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="
                  w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                "
                                placeholder="New email address"
                            />
                        )}

                        {updateType === 'password' && (
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="
                  w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                "
                                placeholder="New password"
                            />
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setProfileOpen(false)}
                                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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