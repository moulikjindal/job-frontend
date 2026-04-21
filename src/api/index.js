import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE } from "../constants";

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor — adds a generic correlation id for logs (optional, harmless)
http.interceptors.request.use((cfg) => cfg);

// Response interceptor — central error handling
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;

    // Network error (no response)
    if (!err.response && err.message !== "canceled") {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(err);
    }

    // 401 — auto-logout through consumer
    if (status === 401 && onUnauthorized && !err.config?.url?.includes("/user/getuser")) {
      onUnauthorized(msg || "Session expired. Please log in again.");
    }

    // 429 — rate limited
    if (status === 429) {
      toast.error(msg || "Too many requests. Please slow down.");
    }

    // Surface "maintenance"/500 clearly
    if (status >= 500) {
      toast.error("Server error. Please try again.");
    }

    return Promise.reject(err);
  }
);

// ---- User / Auth ----
export const getUser = () => http.get("/user/getuser");
export const getPublicUser = (id) => http.get(`/user/public/${id}`);
export const loginUser = (payload) =>
  http.post("/user/login", payload, { headers: { "Content-Type": "application/json" } });
export const registerUser = (payload) =>
  http.post("/user/register", payload, { headers: { "Content-Type": "application/json" } });
export const logoutUser = () => http.get("/user/logout");
export const forgotPassword = (email) =>
  http.post("/user/forgot-password", { email }, { headers: { "Content-Type": "application/json" } });

// ---- Profile ----
export const updateProfile = (payload) =>
  http.put("/user/profile", payload, { headers: { "Content-Type": "application/json" } });
export const changePassword = (payload) =>
  http.put("/user/password", payload, { headers: { "Content-Type": "application/json" } });

// ---- Stats / activity ----
export const getStats = () => http.get("/user/stats");
export const getRecentActivity = () => http.get("/application/activity");
export const getApplicationsOverTime = (days = 14) => http.get("/application/over-time", { params: { days } });

// ---- Saved jobs ----
export const getSavedJobs = () => http.get("/user/saved");
export const toggleSaveJob = (id) => http.post(`/user/saved/${id}`);

// ---- Jobs ----
export const getAllJobs = (params = {}) => http.get("/job/getall", { params });
export const getJobById = (id) => http.get(`/job/${id}`);
export const getSimilarJobs = (id, limit = 4) => http.get(`/job/${id}/similar`, { params: { limit } });
export const recordJobView = (id) => http.post(`/job/${id}/view`);
export const getTopCategories = (limit = 6) => http.get("/job/top-categories", { params: { limit } });
export const getJobsByCompany = (userId) => http.get(`/job/company/${userId}`);
export const getMyJobs = () => http.get("/job/getmyjobs");
export const postJob = (payload) =>
  http.post("/job/post", payload, { headers: { "Content-Type": "application/json" } });
export const updateJob = (id, payload) => http.put(`/job/update/${id}`, payload);
export const deleteJob = (id) => http.delete(`/job/delete/${id}`);
export const duplicateJob = (id) => http.post(`/job/duplicate/${id}`);

// ---- Applications ----
export const getEmployerApplications = () => http.get("/application/employer/getall");
export const getJobSeekerApplications = () => http.get("/application/jobseeker/getall");
export const postApplication = (formData) =>
  http.post("/application/post", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteApplication = (id) => http.delete(`/application/delete/${id}`);
export const updateApplicationStatus = (id, status, note = "") =>
  http.put(`/application/status/${id}`, { status, note }, { headers: { "Content-Type": "application/json" } });
export const rateApplication = (id, rating) =>
  http.put(`/application/rate/${id}`, { rating }, { headers: { "Content-Type": "application/json" } });
export const updateApplicationNotes = (id, notes) =>
  http.put(`/application/notes/${id}`, { notes }, { headers: { "Content-Type": "application/json" } });

export default http;
