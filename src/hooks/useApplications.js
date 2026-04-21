import { useEffect, useState, useCallback } from "react";
import * as api from "../api";

export const useApplications = (role) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!role) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const fetcher = role === "Employer" ? api.getEmployerApplications : api.getJobSeekerApplications;
      const res = await fetcher();
      setApplications(res.data.applications || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    await api.deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a._id !== id));
  };

  const updateStatus = async (id, status, note = "") => {
    const { data } = await api.updateApplicationStatus(id, status, note);
    setApplications((prev) => prev.map((a) =>
      a._id === id ? { ...a, status: data.application.status, statusHistory: data.application.statusHistory } : a
    ));
    return data;
  };

  const rate = async (id, rating) => {
    const { data } = await api.rateApplication(id, rating);
    setApplications((prev) => prev.map((a) =>
      a._id === id ? { ...a, employerRating: data.application.employerRating } : a
    ));
    return data;
  };

  const saveNotes = async (id, notes) => {
    const { data } = await api.updateApplicationNotes(id, notes);
    setApplications((prev) => prev.map((a) =>
      a._id === id ? { ...a, employerNotes: data.application.employerNotes } : a
    ));
    return data;
  };

  return { applications, loading, error, remove, updateStatus, rate, saveNotes, reload: load };
};
