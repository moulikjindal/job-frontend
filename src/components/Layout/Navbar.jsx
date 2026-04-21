import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSun, FiMoon, FiLogOut, FiUser, FiBookmark, FiBarChart2 } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import "./Navbar.css";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthorized, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setShow(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          Job<span>.Com</span>
        </Link>
        <ul className={`nav-menu ${show ? "open" : ""}`}>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/job/getall">Browse Jobs</NavLink></li>

          {isAuthorized && (
            <li>
              <NavLink to="/applications/me">
                {user?.role === "Employer" ? "Applicants" : "My Applications"}
              </NavLink>
            </li>
          )}
          {isAuthorized && user?.role === "Job Seeker" && (
            <li><NavLink to="/jobs/saved">Saved</NavLink></li>
          )}
          {isAuthorized && user?.role === "Employer" && (
            <>
              <li><NavLink to="/job/post">Post Job</NavLink></li>
              <li><NavLink to="/job/me">My Jobs</NavLink></li>
            </>
          )}
          {isAuthorized && (
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          )}

          <li>
            <button className="nav-theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
          </li>

          {isAuthorized ? (
            <li className="nav-user">
              <button className="nav-avatar" onClick={() => setMenuOpen((v) => !v)} title={user?.name}>
                {initials}
              </button>
              {menuOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dd-header">
                    <div className="nav-dd-name">{user?.name}</div>
                    <div className="nav-dd-role">{user?.role}</div>
                  </div>
                  <Link to="/profile" className="nav-dd-item"><FiUser /> Profile</Link>
                  <Link to="/dashboard" className="nav-dd-item"><FiBarChart2 /> Dashboard</Link>
                  {user?.role === "Job Seeker" && (
                    <Link to="/jobs/saved" className="nav-dd-item"><FiBookmark /> Saved Jobs</Link>
                  )}
                  <button className="nav-dd-item nav-dd-danger" onClick={logout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li><Link to="/login" className="nav-login">Login</Link></li>
              <li><Link to="/register" className="nav-signup">Sign Up</Link></li>
            </>
          )}
        </ul>

        <div className="nav-hamburger" onClick={() => setShow(!show)} aria-label="Toggle menu">
          <GiHamburgerMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
