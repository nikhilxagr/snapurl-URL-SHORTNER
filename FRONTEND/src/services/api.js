import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
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
