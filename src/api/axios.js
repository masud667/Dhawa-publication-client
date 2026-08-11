import axios from "axios";

const api = axios.create({
    baseURL: "https://dhawa-publication-server.vercel.app",
});

export default api;