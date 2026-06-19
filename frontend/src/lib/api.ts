import axios from "axios";

let API_BASE_URL = "http://localhost:8000";
try {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    const url = String(process.env.NEXT_PUBLIC_API_URL).trim();
    if (url && url !== "undefined" && url.startsWith("http")) {
      API_BASE_URL = url;
    }
  }
} catch (e) {
  // fallback to localhost
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url} - token present`);
      } else {
        console.warn(`[API] ${config.method?.toUpperCase()} ${config.url} - NO token in localStorage`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && error.response?.data?.detail === "Not authenticated") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh: refreshToken,
          });

          const accessToken = response.data.access_token;
          localStorage.setItem("access_token", accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    PROFILE: "/api/user/profile",
  },
  PREDICTIONS: {
    CREATE: "/api/predictions",
    LIST: "/api/predictions/history",
    DETAIL: (id: number) => `/api/predictions/${id}`,
    HISTORY: "/api/predictions/history",
  },
  ROUTES: {
    LIST: "/api/routes",
    CREATE: "/api/routes/save",
    DELETE: (id: number) => `/api/routes/${id}`,
  },
  ADMIN: {
    USERS: "/api/admin/users",
    USER_DETAIL: (id: number) => `/api/admin/users/${id}`,
    MODELS: "/api/admin/predictions",
    MODEL_DETAIL: (id: number) => `/api/admin/predictions/${id}`,
    ANALYTICS: "/api/admin/analytics/overview",
    LOGS: "/api/admin/logs",
    DASHBOARD: "/api/admin/analytics/overview",
  },
};
