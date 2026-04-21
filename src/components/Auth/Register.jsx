import React, { useState } from "react";
import { FaRegUser, FaPencilAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPhoneFlip } from "react-icons/fa6";
import { FiSun, FiMoon } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Input, Select, Button } from "../../ui";
import PasswordStrength, { scorePassword } from "../Common/PasswordStrength";
import Confetti from "../Common/Confetti";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const { isAuthorized, register, authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!role) return toast.error("Please select a role.");
    const { score } = scorePassword(password);
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (score < 2) return toast.error("Please choose a stronger password.");
    setSubmitting(true);
    try {
      await register({ name, phone, email, role, password });
      setCelebrate(true);
      setName(""); setEmail(""); setPassword(""); setPhone(""); setRole("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthorized && !authLoading) return <Navigate to="/" replace />;

  return (
    <section className="auth-page">
      <button className="auth-theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </button>
      <div className="auth-form-side">
        <div className="auth-header">
          <Link to="/" className="auth-brand">Job<span>.Com</span></Link>
          <h3>Create your account</h3>
          <p className="auth-subtitle">Join thousands finding their next role</p>
        </div>
        <form className="auth-form" onSubmit={handleRegister}>
          <Select
            label="Register As"
            icon={FaRegUser}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Select Role"
            options={["Employer", "Job Seeker"]}
          />
          <Input label="Full Name" icon={FaPencilAlt} type="text" placeholder="Your Name"
            value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" icon={MdOutlineMailOutline} type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <Input label="Phone" icon={FaPhoneFlip} type="tel" placeholder="e.g. +1 555 123 4567"
            value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div>
            <Input label="Password" icon={RiLock2Fill} type="password" placeholder="Min. 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              autoComplete="new-password" />
            <PasswordStrength value={password} />
          </div>
          <Button type="submit" block disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
          <p className="auth-alt">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          <p className="auth-alt auth-terms">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
      <Confetti active={celebrate} />
    </section>
  );
};

export default Register;
