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

    const [updateType, setUpdateType] = useState('email'); // email | password
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
            <header className="bg-white dark:bg-darkBg shadow-md p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
                {/* LEFT */}
                <div className="flex items-center w-full md:w-auto gap-3">
                    <img
                        src={logo}
                        alt="Drive Logo"
                        className="h-8 cursor-pointer"
                        onClick={() => window.location.href = '/drive'}
                    />

                    <div className="relative flex-1 w-full md:w-auto">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Drive"
                            className="pl-10 pr-4 py-2 rounded-full bg-secondary dark:bg-darkCard w-full md:w-80 outline-none text-sm md:text-base"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
                    <DarkModeToggle />

                    {/* PROFILE */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm md:text-base"
                        >
                            {firstLetter}
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-darkCard rounded-lg shadow border dark:border-gray-700 z-50">
                                <div className="px-4 py-3 border-b dark:border-gray-700">
                                    <p className="text-sm font-medium truncate">{user?.email}</p>
                                    <p className="text-xs text-gray-500">Signed in</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setProfileOpen(true);
                                        setMenuOpen(false);
                                        setMessage('');
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary dark:hover:bg-darkBg"
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                    Update profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary dark:hover:bg-darkBg"
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
                    <div className="bg-white dark:bg-darkBg p-6 rounded-lg w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4 text-center">Update Profile</h2>

                        {message && (
                            <p className="text-sm mb-3 text-center text-primary truncate">
                                {message}
                            </p>
                        )}

                        {/* CHOICE */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="updateType"
                                    value="email"
                                    checked={updateType === 'email'}
                                    onChange={() => setUpdateType('email')}
                                />
                                Update Email
                            </label>

                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="updateType"
                                    value="password"
                                    checked={updateType === 'password'}
                                    onChange={() => setUpdateType('password')}
                                />
                                Update Password
                            </label>
                        </div>

                        {/* EMAIL */}
                        {updateType === 'email' && (
                            <>
                                <label className="text-sm">New Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border p-2 rounded mb-2 dark:bg-darkCard"
                                />
                                <p className="text-xs text-gray-500 mb-3 text-center">
                                    Verification email will be sent
                                </p>
                            </>
                        )}

                        {/* PASSWORD */}
                        {updateType === 'password' && (
                            <>
                                <label className="text-sm">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border p-2 rounded mb-3 dark:bg-darkCard"
                                />
                            </>
                        )}

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setProfileOpen(false);
                                    setMessage('');
                                }}
                                className="px-4 py-2 border rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={loading}
                                onClick={handleUpdateProfile}
                                className="px-4 py-2 bg-primary text-white rounded w-full sm:w-auto"
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
