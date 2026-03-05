// pages/ResetPassword.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function ResetPassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 p-4 sm:p-6">
            <form
                onSubmit={handleReset}
                className="bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700 animate-scale-in"
            >
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Reset Password
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Enter your new password below
                    </p>
                </div>

                {error && (
                    <p className="text-red-600 dark:text-red-400 text-sm mb-4 text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        {error}
                    </p>
                )}

                <input
                    type="password"
                    required
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 px-4 py-3 rounded-xl mb-6 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                <button
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? 'Updating…' : 'Update Password'}
                </button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    Remember your password?{' '}
                    <a href="/" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    );
}
