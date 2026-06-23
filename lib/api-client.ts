import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/api/auth/refresh");

        return apiClient(originalRequest);
      } catch {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
