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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
            <form
                onSubmit={handleReset}
                className="bg-white dark:bg-darkCard p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md"
            >
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    Reset Password
                </h2>

                {error && (
                    <p className="text-red-600 text-sm mb-3 text-center truncate">
                        {error}
                    </p>
                )}

                <input
                    type="password"
                    required
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-4 py-3 rounded-lg mb-4 dark:bg-darkBg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Updating…' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}
