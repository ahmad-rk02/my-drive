import React, { useState } from 'react';
import { supabase } from '../supabase';
import {
    CloudArrowUpIcon,
    ClockIcon,
    StarIcon,
    TrashIcon,
    ShieldCheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Landing() {
    const [authType, setAuthType] = useState(null); // login | signup | forgot
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const resetStates = () => {
        setError(null);
        setMessage(null);
    };

    /* ================= AUTH HANDLER ================= */
    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        resetStates();

        try {
            // LOGIN
            if (authType === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = '/drive';
            }

            // SIGNUP
            if (authType === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                setMessage(
                    'If this email is new, a confirmation link has been sent. Please check your inbox.'
                );
                setAuthType('login');
            }

            // FORGOT PASSWORD
            if (authType === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(
                    email,
                    {
                        redirectTo: `${window.location.origin}/reset-password`,
                    }
                );
                if (error) throw error;

                setMessage('Password reset link sent. Check your email.');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
            {authType && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-10" />
            )}

            {/* HERO */}
            <header className="max-w-7xl mx-auto px-6 py-28 text-center">
                <h1 className="text-6xl font-extrabold">AK Drive</h1>
                <p className="mt-6 text-xl text-gray-600">
                    Secure cloud storage — upload, organize, and access anywhere.
                </p>

                <div className="mt-10 flex justify-center gap-4">
                    <button
                        onClick={() => { setAuthType('signup'); resetStates(); }}
                        className="px-8 py-4 rounded-full bg-primary text-white"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => { setAuthType('login'); resetStates(); }}
                        className="px-8 py-4 rounded-full border-2 border-primary text-primary"
                    >
                        Sign In
                    </button>
                </div>
            </header>

            {/* FEATURES */}
            <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    [CloudArrowUpIcon, 'Upload Files'],
                    [StarIcon, 'Star Files'],
                    [TrashIcon, 'Safe Trash'],
                    [ClockIcon, 'Recent View'],
                    [ShieldCheckIcon, 'Secure'],
                ].map(([Icon, title], i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-8">
                        <Icon className="h-10 w-10 text-primary" />
                        <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                    </div>
                ))}
            </section>

            {/* AUTH MODAL */}
            {authType && (
                <div className="fixed inset-0 z-20 flex items-center justify-center px-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <button
                            onClick={() => setAuthType(null)}
                            className="absolute top-4 right-4"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        <h2 className="text-3xl font-bold text-center mb-6">
                            {authType === 'login' && 'Sign in'}
                            {authType === 'signup' && 'Create account'}
                            {authType === 'forgot' && 'Reset password'}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 bg-red-50 p-3 rounded text-sm text-center">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-4 text-green-600 bg-green-50 p-3 rounded text-sm text-center">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full px-4 py-3 border rounded-lg"
                            />

                            {authType !== 'forgot' && (
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                            )}

                            <button
                                disabled={loading}
                                className="w-full py-3 bg-primary text-white rounded-lg"
                            >
                                {loading ? 'Please wait...' : (
                                    authType === 'login'
                                        ? 'Sign In'
                                        : authType === 'signup'
                                            ? 'Create Account'
                                            : 'Send Reset Link'
                                )}
                            </button>
                        </form>

                        {/* LINKS */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            {authType === 'login' && (
                                <>
                                    <button
                                        onClick={() => setAuthType('forgot')}
                                        className="text-primary hover:underline block"
                                    >
                                        Forgot password?
                                    </button>
                                    <p className="mt-2">
                                        No account?{' '}
                                        <button
                                            onClick={() => setAuthType('signup')}
                                            className="text-primary font-medium"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                </>
                            )}

                            {(authType === 'signup' || authType === 'forgot') && (
                                <button
                                    onClick={() => setAuthType('login')}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Back to Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <footer className="py-8 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} My Drive
            </footer>
        </div>
    );
}
