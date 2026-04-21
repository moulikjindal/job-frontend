import React, { useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { Link, Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Input, Select, Button } from "../../ui";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthorized, login, authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) return toast.error("Please select a role.");
    setSubmitting(true);
    try {
      await login({ email, password, role });
      setEmail(""); setPassword(""); setRole("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthorized && !authLoading) {
    const redirectTo = location.state?.from && location.state.from !== "/login" ? location.state.from : "/";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <section className="auth-page">
      <button className="auth-theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </button>
      <div className="auth-form-side">
        <div className="auth-header">
          <Link to="/" className="auth-brand">Job<span>.Com</span></Link>
          <h3>Welcome back</h3>
          <p className="auth-subtitle">Log in to continue your journey</p>
        </div>
        <form className="auth-form" onSubmit={handleLogin}>
          <Select
            label="Login As"
            icon={FaRegUser}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Select Role"
            options={["Employer", "Job Seeker"]}
          />
          <Input
            label="Email Address"
            icon={MdOutlineMailOutline}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            icon={RiLock2Fill}
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="auth-row-between">
            <Link to="/forgot-password" className="auth-inline-link">Forgot password?</Link>
          </div>
          <Button type="submit" block disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </Button>
          <p className="auth-alt">
            Don't have an account? <Link to="/register">Register now</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
