import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Free hosting tiers sleep when idle and can take up to a minute to wake.
  timeout: 60000,
});

const EXERCISES_ENDPOINT = "/api/exercises/";

function cleanParams(params) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("oa_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      const isAuthRoute = error.config.url?.includes('/auth/')
      if (!isAuthRoute) {
        localStorage.removeItem("oa_token");
        localStorage.removeItem("oa_user");
        alert('Your session has expired. Please login again.');
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorDetails(error, serviceName = "service") {
  if (error.code === "ECONNABORTED") {
    return {
      type: "timeout",
      message: `The ${serviceName} request timed out. Please try again.`,
    };
  }

  if (!error.response) {
    return {
      type: "network",
      message: `Unable to connect to the ${serviceName}. Please check your connection and try again.`,
    };
  }

  const status = error.response.status;
  const messages = {
    401: "Your session has expired. Please sign in again.",
    403: `You do not have permission to access the ${serviceName}.`,
    404: `${serviceName[0].toUpperCase()}${serviceName.slice(1)} endpoint is unavailable.`,
    500: `The ${serviceName} is temporarily unavailable.`,
  };

  return {
    type: "http",
    status,
    message: messages[status] || `The ${serviceName} returned an unexpected error.`,
  };
}

export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
};

const exerciseRequestConfig = (params) => ({
  params: cleanParams(params),
  skipAuthRedirect: true,
});

export const exercisesAPI = {
  list: (params) => api.get(EXERCISES_ENDPOINT, exerciseRequestConfig(params)),
  getAll: (params) => exercisesAPI.list(params),
  getOne: (id) => api.get(`${EXERCISES_ENDPOINT}${id}`, exerciseRequestConfig()),
  create: (data) => api.post(EXERCISES_ENDPOINT, data),
  update: (id, data) => api.put(`${EXERCISES_ENDPOINT}${id}`, data),
  delete: (id) => api.delete(`${EXERCISES_ENDPOINT}${id}`),
};

export const progressAPI = {
  logExercise: (data) => api.post("/api/progress/log", data),
  getLogs: (days) => api.get("/api/progress/logs", { params: { days } }),
  getSummary: () => api.get("/api/progress/summary"),
  logPain: (data) => api.post("/api/progress/pain", data),
  getPainDiary: (days) => api.get("/api/progress/pain", { params: { days } }),
  updateStatus: (data) => api.patch('/api/progress/status', data),
  getStatuses: () => api.get('/api/progress/status'),
};

export const userAPI = {
  getProfile: () => api.get("/api/users/me"),
  updateProfile: (data) => api.put("/api/users/me", data),
};

export const adminAPI = {
  getStats: () => api.get("/api/admin/stats"),
  getUsers: (params) => api.get("/api/admin/users", { params }),
  getUserActivity: (id) => api.get(`/api/admin/users/${id}/activity`),
  getExercises: (params) => api.get("/api/admin/exercises", { params }),
  toggleUserActive: (id) => api.patch(`/api/admin/users/${id}/toggle-active`),
  seedExercises: () => api.post("/api/admin/seed-exercises"),
  getExerciseStatusOverview: () => api.get('/api/admin/exercise-status-overview'),
  getUserExerciseStatus: (userId) => api.get(`/api/admin/users/${userId}/exercise-status`),
};

export default api;
