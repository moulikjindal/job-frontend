import { useCallback, useEffect, useState } from "react";

const KEY = "jobcom:recentSearches";
const MAX = 6;

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

export const useRecentSearches = () => {
  const [items, setItems] = useState(() => read());

  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setItems(read()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((term) => {
    const t = String(term || "").trim();
    if (!t) return;
    const prev = read().filter((x) => x.toLowerCase() !== t.toLowerCase());
    const next = [t, ...prev].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
  }, []);

  const remove = useCallback((term) => {
    const next = read().filter((x) => x !== term);
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setItems([]);
  }, []);

  return { items, add, remove, clear };
};
