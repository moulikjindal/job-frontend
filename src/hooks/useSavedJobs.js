import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../main";
import * as api from "../api";

export const useSavedJobs = () => {
  const { user, savedJobIds, setSavedJobIds } = useContext(Context);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (user?.role !== "Job Seeker") return;
    setLoading(true);
    try {
      const { data } = await api.getSavedJobs();
      setSavedJobs(data.jobs || []);
      setSavedJobIds((data.jobs || []).map((j) => j._id));
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [user, setSavedJobIds]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (jobId) => {
    try {
      const { data } = await api.toggleSaveJob(jobId);
      setSavedJobIds((prev) =>
        data.saved ? [...new Set([...prev, jobId])] : prev.filter((id) => id !== jobId)
      );
      if (!data.saved) setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success(data.message);
      return data.saved;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update saved jobs");
      return null;
    }
  };

  const isSaved = (jobId) => savedJobIds.includes(jobId);

  return { savedJobs, savedJobIds, loading, toggle, isSaved, reload: load };
};
