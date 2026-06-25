import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't retry twice
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Ignore auth endpoints
    if (
      originalRequest.url?.includes("/api/auth/login") ||
      originalRequest.url?.includes("/api/auth/logout") ||
      originalRequest.url?.includes("/api/auth/refresh") ||
      originalRequest.url?.includes("/api/auth/me")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/api/auth/refresh");

        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
