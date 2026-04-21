import React, { useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "../../hooks/useTheme";
import { Input, Button } from "../../ui";
import * as api from "../../api";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
      toast.success("If that email exists, a reset link is on the way.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <button className="auth-theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </button>
      <div className="auth-form-side">
        <div className="auth-header">
          <Link to="/" className="auth-brand">Job<span>.Com</span></Link>
          <h3>Forgot your password?</h3>
          <p className="auth-subtitle">
            Enter your email and we'll send you a link to reset it.
          </p>
        </div>

        {sent ? (
          <div className="auth-form" style={{ textAlign: "center", gap: 18 }}>
            <p style={{ fontSize: "3rem" }}>📧</p>
            <p className="auth-subtitle">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link.
            </p>
            <Link to="/login" className="auth-alt" style={{ marginTop: 12 }}>
              Back to login
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
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
            <Button type="submit" block disabled={submitting}>
              {submitting ? "Sending..." : "Send reset link"}
            </Button>
            <p className="auth-alt">
              Remembered it? <Link to="/login">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default ForgotPassword;
