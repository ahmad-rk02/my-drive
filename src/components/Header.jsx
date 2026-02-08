import { useEffect, useState } from 'react';
import {
    MagnifyingGlassIcon,
    ArrowRightOnRectangleIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { supabase } from '../supabase';
import DarkModeToggle from './DarkModeToggle';
import logo from '../assets/Ayarn.jpg';

const Header = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [updateType, setUpdateType] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    /* ---------------- GET LOGGED IN USER ---------------- */
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setUser(data.user);
                setEmail(data.user.email);
            }
        });
    }, []);

    /* ---------------- SEARCH ---------------- */
    const handleSearch = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(query);
        }
    };

    /* ---------------- LOGOUT ---------------- */
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    /* ---------------- UPDATE PROFILE ---------------- */
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
            setMessage(err.message);
        }

        setLoading(false);
    };

    const firstLetter = user?.email?.charAt(0).toUpperCase();

    return (
        <>
            {/* ================= HEADER ================= */}
            <header className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 flex items-center justify-between gap-4">

                {/* LEFT */}
                <div className="flex items-center gap-3">
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

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                    {/* Theme toggle */}
                    <DarkModeToggle />

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="
                              h-9 w-9 rounded-full
                              bg-blue-600 text-white
                              flex items-center justify-center
                              font-semibold
                              hover:ring-2 hover:ring-blue-400
                            "
                        >
                            {firstLetter}
                        </button>

                        {menuOpen && (
                            <div className="
                              absolute right-0 mt-2 w-56
                              bg-white dark:bg-gray-800
                              border border-gray-200 dark:border-gray-700
                              rounded-lg shadow-lg z-50
                            ">
                                <div className="px-4 py-3 border-b dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {user?.email}
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
                                      w-full flex items-center gap-2
                                      px-4 py-2 text-sm
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
                                      w-full flex items-center gap-2
                                      px-4 py-2 text-sm
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

            {/* ================= UPDATE PROFILE MODAL ================= */}
            {profileOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">
                            Update Profile
                        </h2>

                        {message && (
                            <p className="text-sm mb-3 text-center text-blue-600">
                                {message}
                            </p>
                        )}

                        <div className="flex gap-4 justify-center mb-4 text-sm text-gray-700 dark:text-gray-200">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={updateType === 'email'}
                                    onChange={() => setUpdateType('email')}
                                />
                                Email
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={updateType === 'password'}
                                    onChange={() => setUpdateType('password')}
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
                                  w-full p-2 rounded border
                                  bg-gray-100 dark:bg-gray-800
                                  text-gray-900 dark:text-gray-100
                                "
                            />
                        )}

                        {updateType === 'password' && (
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="
                                  w-full p-2 rounded border
                                  bg-gray-100 dark:bg-gray-800
                                  text-gray-900 dark:text-gray-100
                                "
                            />
                        )}

                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setProfileOpen(false)}
                                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
