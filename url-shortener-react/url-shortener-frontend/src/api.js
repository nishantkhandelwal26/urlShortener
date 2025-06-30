// ✅ Place logs at the top level (inside module scope)

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL,
  TIMEOUT: 10000,
  ENDPOINTS: {
    SHORTEN_URL: import.meta.env.VITE_API_SHORTEN_URL,
    USER_URLS: import.meta.env.VITE_API_USER_URLS,
    DELETE_URL: import.meta.env.VITE_API_DELETE_URL,
    LOGIN: import.meta.env.VITE_API_LOGIN,
    REGISTER: import.meta.env.VITE_API_REGISTER,
    LOGOUT: import.meta.env.VITE_API_LOGOUT,
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers with authentication
export const getAuthHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};
