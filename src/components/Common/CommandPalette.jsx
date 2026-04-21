import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiHome, FiBriefcase, FiBookmark, FiUser, FiBarChart2,
  FiLogOut, FiLogIn, FiPlus, FiFileText, FiMoon, FiSun,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import "./CommandPalette.css";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthorized, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allCommands = useMemo(() => {
    const base = [
      { id: "home", title: "Go to Home", icon: FiHome, keywords: "home landing", run: () => navigate("/") },
      { id: "jobs", title: "Browse Jobs", icon: FiSearch, keywords: "jobs browse search", run: () => navigate("/job/getall") },
      { id: "theme", title: `Switch to ${theme === "light" ? "dark" : "light"} theme`, icon: theme === "light" ? FiMoon : FiSun, keywords: "theme dark light", run: toggleTheme },
    ];
    if (isAuthorized) {
      base.push(
        { id: "dashboard", title: "Open Dashboard", icon: FiBarChart2, keywords: "dashboard stats", run: () => navigate("/dashboard") },
        { id: "profile", title: "Edit Profile", icon: FiUser, keywords: "profile account settings", run: () => navigate("/profile") },
        { id: "my-apps", title: user?.role === "Employer" ? "View Applicants" : "My Applications", icon: FiFileText, keywords: "applications", run: () => navigate("/applications/me") },
        { id: "logout", title: "Log out", icon: FiLogOut, keywords: "logout signout", run: logout },
      );
      if (user?.role === "Employer") {
        base.push(
          { id: "post-job", title: "Post a New Job", icon: FiPlus, keywords: "post create job new", run: () => navigate("/job/post") },
          { id: "my-jobs", title: "My Posted Jobs", icon: FiBriefcase, keywords: "my jobs posted", run: () => navigate("/job/me") },
        );
      } else {
        base.push(
          { id: "saved", title: "Saved Jobs", icon: FiBookmark, keywords: "saved bookmarks", run: () => navigate("/jobs/saved") },
        );
      }
    } else {
      base.push(
        { id: "login", title: "Log in", icon: FiLogIn, keywords: "login signin", run: () => navigate("/login") },
        { id: "register", title: "Create account", icon: FiUser, keywords: "register signup", run: () => navigate("/register") },
      );
    }
    return base;
  }, [isAuthorized, user, theme, logout, navigate, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCommands;
    return allCommands.filter((c) =>
      (c.title + " " + c.keywords).toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  const run = (cmd) => {
    setOpen(false);
    cmd.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && filtered[active]) run(filtered[active]);
  };

  if (!open) return null;

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
      <div className="cmdk-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <FiSearch />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            aria-label="Command palette"
          />
          <kbd className="cmdk-kbd">Esc</kbd>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 ? (
            <div className="cmdk-empty">No results</div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  className={`cmdk-item ${active === i ? "cmdk-item--active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(cmd)}
                >
                  <Icon />
                  <span>{cmd.title}</span>
                </button>
              );
            })
          )}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> select</span>
          <span><kbd>Ctrl</kbd> + <kbd>K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
