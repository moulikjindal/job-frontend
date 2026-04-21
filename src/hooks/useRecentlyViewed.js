import { useCallback, useEffect, useState } from "react";

const KEY = "jobcom:recentlyViewed";
const MAX = 6;

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch { return []; }
};

export const useRecentlyViewed = () => {
  const [items, setItems] = useState(() => read());

  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setItems(read()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((job) => {
    if (!job?._id) return;
    const slim = {
      _id: job._id,
      title: job.title,
      city: job.city,
      country: job.country,
      category: job.category,
      companyName: job.postedBy?.companyName || job.postedBy?.name,
    };
    const prev = read().filter((x) => x._id !== slim._id);
    const next = [slim, ...prev].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setItems([]);
  }, []);

  return { items, add, clear };
};
