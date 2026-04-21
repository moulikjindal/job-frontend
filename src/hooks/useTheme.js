import { useCallback, useEffect, useState } from "react";

const STORAGE = "theme";

const getSystem = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initial = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(STORAGE) || getSystem();
};

export const useTheme = () => {
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE, theme);
  }, [theme]);

  // Follow system if user hasn't explicitly chosen
  useEffect(() => {
    if (localStorage.getItem(STORAGE)) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      // Add a brief "theme-transition" class for subtle crossfade
      document.documentElement.classList.add("theme-transition");
      setTimeout(() => document.documentElement.classList.remove("theme-transition"), 400);
      return next;
    });
  }, []);

  return { theme, toggleTheme, setTheme };
};
