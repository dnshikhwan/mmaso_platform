import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const axiosConfig = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    timeout: 10000,
});
