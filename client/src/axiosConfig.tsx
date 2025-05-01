import axios, { AxiosError } from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const axiosConfig = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    timeout: 10000,
});

axiosConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);

            if (error.response?.status === 401) {
                return (window.location.href = "/");
            }
        }
    }
);
