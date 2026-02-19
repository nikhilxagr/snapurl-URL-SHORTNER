import axios from "axios";

const rawApiBase = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const trimmedApiBase = rawApiBase.replace(/\/+$/, "");
const baseURL = trimmedApiBase.endsWith("/api")
  ? trimmedApiBase
  : `${trimmedApiBase}/api`;

export const AUTH_TOKEN_KEY = "snapurl_access_token";

export const getStoredAuthToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
};

export const setStoredAuthToken = (token) => {
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const isAuthEndpoint = (url = "") => {
  return ["/auth/me", "/auth/login", "/auth/register"].some((path) =>
    url.includes(path),
  );
};

const isAuthPage = () => {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path === "/login" || path === "/register";
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getStoredAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      setStoredAuthToken("");
      const requestUrl = error.config?.url || "";

      // Avoid redirect loops for auth probe endpoints.
      if (!isAuthEndpoint(requestUrl) && !isAuthPage()) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
