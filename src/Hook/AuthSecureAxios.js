import axios from "axios";

const AuthSecureAxios = axios.create({
    // Uses VITE_API_URL if defined, otherwise defaults to localhost:5000
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true,
});

// Intercept requests to automatically attach the stored JWT token
AuthSecureAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default AuthSecureAxios;