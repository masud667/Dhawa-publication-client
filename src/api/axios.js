import axios from "axios";

// Access environment variable or fall back to local backend URL
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
});

// Intercept outgoing requests to attach JWT Bearer token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;