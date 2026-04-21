import { useEffect, useState, useCallback } from "react";
import * as api from "../api";

export const useJobs = (initial = {}) => {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1, pageSize: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ sort: "newest", page: 1, limit: 12, ...initial });

  const fetch = useCallback(async (p = params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.getAllJobs(p);
      setJobs(data.jobs || []);
      setMeta({ total: data.total || 0, page: data.page || 1, pages: data.pages || 1, pageSize: data.pageSize || 12 });
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetch(params); /* eslint-disable-next-line */ }, [params]);

  return { jobs, meta, loading, error, params, setParams, refresh: () => fetch(params) };
};

export const useJobDetail = (id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getJobById(id)
      .then((res) => { if (!cancelled) setJob(res.data.job); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { job, loading, error };
};

export const useMyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.getMyJobs();
      setMyJobs(data.myJobs || []);
    } catch {
      setMyJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateJobLocal = (jobId, field, value) => {
    setMyJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, [field]: value } : j)));
  };

  const saveJob = async (jobId) => {
    const job = myJobs.find((j) => j._id === jobId);
    const payload = { ...job };
    if (typeof payload.expired === "string") payload.expired = payload.expired === "true";
    if (typeof payload.isRemote === "string") payload.isRemote = payload.isRemote === "true";
    if (typeof payload.featured === "string") payload.featured = payload.featured === "true";
    const { data } = await api.updateJob(jobId, payload);
    return data;
  };

  const toggleField = async (jobId, field) => {
    const job = myJobs.find((j) => j._id === jobId);
    const next = !Boolean(job?.[field]);
    updateJobLocal(jobId, field, next);
    try {
      await api.updateJob(jobId, { [field]: next });
    } catch (e) {
      // Roll back local state on failure
      updateJobLocal(jobId, field, !next);
      throw e;
    }
  };

  const removeJob = async (jobId) => {
    const { data } = await api.deleteJob(jobId);
    setMyJobs((prev) => prev.filter((j) => j._id !== jobId));
    return data;
  };

  const cloneJob = async (jobId) => {
    const { data } = await api.duplicateJob(jobId);
    if (data.job) setMyJobs((prev) => [{ ...data.job, applicationsCount: 0 }, ...prev]);
    return data;
  };

  return {
    myJobs, loading, updateJobLocal, saveJob, removeJob, reload: load,
    toggleField, cloneJob,
  };
};
