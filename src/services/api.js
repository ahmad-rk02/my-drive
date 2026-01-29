// services/api.js
import axios from 'axios';
import { supabase } from '../supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor → attach access token
api.interceptors.request.use(async (config) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    } catch (err) {
        console.error('Error attaching token:', err);
        return config;
    }
});

// Response interceptor → handle 401 globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Optional: clear session and redirect
            await supabase.auth.signOut();

            // Use a safe redirect
            window.location.replace('/'); // replaces history entry, cleaner than href
        }
        return Promise.reject(error);
    }
);

export default api;
