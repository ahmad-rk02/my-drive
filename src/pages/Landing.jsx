import React, { useState } from 'react';
import { supabase } from '../supabase';
import {
    CloudArrowUpIcon,
    ShieldCheckIcon,
    XMarkIcon,
    LockClosedIcon,
    DevicePhoneMobileIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    FolderIcon,
    DocumentTextIcon,
    UsersIcon,
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
        <div className="relative min-h-screen bg-white dark:bg-slate-950">
            {/* Modal Overlay */}
            {authType && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            )}

            {/* Navigation */}
            <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                <CloudArrowUpIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                AK Drive
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { setAuthType('login'); resetStates(); }}
                                className="px-4 sm:px-5 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setAuthType('signup'); resetStates(); }}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                                <CheckCircleIcon className="h-5 w-5" />
                                Trusted by thousands worldwide
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                Secure Cloud Storage
                                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Store, share, and access your files from anywhere. Enterprise-grade security meets consumer simplicity.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                                <button
                                    onClick={() => {
                                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="group px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Explore Features
                                        <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                                >
                                    Learn More
                                </button>
                            </div>

                            <p className="text-center lg:text-left text-sm text-gray-500 dark:text-gray-500 mb-12">
                                No credit card required • 15GB free storage • Cancel anytime
                            </p>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                                    <span>Bank-level security</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    <span>GDPR compliant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    <span>99.9% uptime</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative hidden lg:block">
                            <div className="relative">
                                {/* Main Card */}
                                <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                            <FolderIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">My Documents</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">24 files</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {['Project Proposal.pdf', 'Budget 2024.xlsx', 'Team Photo.jpg'].map((file, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{file}</span>
                                                <span className="text-xs text-gray-500">2.4 MB</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-2xl"></div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl opacity-20 blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-12 sm:py-16 bg-gray-50 dark:bg-slate-900 border-y border-gray-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: '15GB', label: 'Free Storage' },
                            { value: '256-bit', label: 'Encryption' },
                            { value: '99.9%', label: 'Uptime' },
                            { value: '24/7', label: 'Support' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything you need in one place
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Powerful features designed for individuals and teams
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: CloudArrowUpIcon,
                                title: 'Easy File Upload',
                                desc: 'Drag and drop files or folders. Upload multiple files at once with our intuitive interface.',
                                color: 'blue'
                            },
                            {
                                icon: LockClosedIcon,
                                title: 'Bank-Level Security',
                                desc: 'Your files are encrypted with 256-bit AES encryption. Your data is always private and secure.',
                                color: 'indigo'
                            },
                            {
                                icon: DevicePhoneMobileIcon,
                                title: 'Access Anywhere',
                                desc: 'Access your files from any device - desktop, tablet, or mobile. Always in sync.',
                                color: 'purple'
                            },
                            {
                                icon: ArrowPathIcon,
                                title: 'Automatic Backup',
                                desc: 'Never lose your files. Automatic backup and version history keeps your data safe.',
                                color: 'pink'
                            },
                            {
                                icon: UsersIcon,
                                title: 'Easy Sharing',
                                desc: 'Share files and folders with anyone. Control who can view, edit, or download.',
                                color: 'cyan'
                            },
                            {
                                icon: ShieldCheckIcon,
                                title: 'Compliance Ready',
                                desc: 'GDPR compliant and SOC 2 certified. Enterprise-grade security for everyone.',
                                color: 'green'
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to get started?
                    </h2>
                    <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who trust AK Drive for their file storage needs. Start your free trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => { setAuthType('signup'); resetStates(); }}
                            className="px-8 py-4 text-lg font-semibold rounded-xl bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                            Create Free Account
                        </button>
                        <button
                            onClick={() => { setAuthType('login'); resetStates(); }}
                            className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        <p>© {new Date().getFullYear()} <span className="font-semibold text-gray-900 dark:text-white">AK Drive</span>. All rights reserved.</p>
                        <p className="mt-2">Secure • Reliable • Fast</p>
                    </div>
                </div>
            </footer>

            {/* AUTH MODAL */}
            {authType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-slate-800 animate-scale-in">
                        {/* Header */}
                        <div className="relative px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                            <button
                                onClick={() => setAuthType(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </button>

                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
                                    <CloudArrowUpIcon className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    {authType === 'login' && 'Welcome back'}
                                    {authType === 'signup' && 'Create your account'}
                                    {authType === 'forgot' && 'Reset password'}
                                </h2>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {authType === 'login' && 'Sign in to access your files'}
                                    {authType === 'signup' && 'Start your free trial today'}
                                    {authType === 'forgot' && 'Enter your email to reset'}
                                </p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 sm:px-8 py-6">
                            {error && (
                                <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                                </div>
                            )}

                            {message && (
                                <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <p className="text-sm text-green-600 dark:text-green-400 text-center">{message}</p>
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {authType !== 'forgot' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Please wait...
                                        </span>
                                    ) : (
                                        <>
                                            {authType === 'login' && 'Sign In'}
                                            {authType === 'signup' && 'Create Account'}
                                            {authType === 'forgot' && 'Send Reset Link'}
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Links */}
                            <div className="mt-6 text-center text-sm">
                                {authType === 'login' && (
                                    <>
                                        <button
                                            onClick={() => setAuthType('forgot')}
                                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                        >
                                            Forgot your password?
                                        </button>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                                            Don't have an account?{' '}
                                            <button
                                                onClick={() => setAuthType('signup')}
                                                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                            >
                                                Sign up
                                            </button>
                                        </p>
                                    </>
                                )}

                                {authType === 'signup' && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => setAuthType('login')}
                                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                )}

                                {authType === 'forgot' && (
                                    <button
                                        onClick={() => setAuthType('login')}
                                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                    >
                                        ← Back to Sign In
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
