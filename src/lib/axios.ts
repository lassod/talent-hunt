import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 20000,
    headers: { 'Content-Type': 'application/json' },
});

/* Attach access token to every request */
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/* Global 401 handler → log them out */
instance.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_refresh_token'); // keep consistent
            window.location.href = 'voting/admin';
        }
        return Promise.reject(err);
    }
);

export default instance;