import { configs } from "@eslint/js";
import axios from "axios";

// Accessing the variable from your secure Config object
const API_URL = configs.API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
});

export default api;
