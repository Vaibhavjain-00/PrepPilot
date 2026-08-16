import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const dashboardService = {
  getDashboard: async () => {
    const response =
      await axiosInstance.get(
        "/dashboard"
      );

    return response.data;
  },
};

export default dashboardService;