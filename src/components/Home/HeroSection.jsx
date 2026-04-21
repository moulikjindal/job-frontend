import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSuitcase, FaBuilding, FaUsers, FaUserPlus, FaMicrosoft, FaGoogle, FaApple, FaAmazon } from "react-icons/fa";
import { SiInfosys, SiWipro } from "react-icons/si";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import "./HeroSection.css";

const stats = [
  { icon: FaSuitcase, value: "1,23,441+", label: "Live Jobs" },
  { icon: FaBuilding, value: "91,220+", label: "Companies" },
  { icon: FaUsers, value: "2,34,200+", label: "Job Seekers" },
  { icon: FaUserPlus, value: "1,03,761+", label: "Employers" },
];

const trusted = [
  { icon: FaMicrosoft, name: "Microsoft" },
  { icon: FaGoogle, name: "Google" },
  { icon: FaApple, name: "Apple" },
  { icon: FaAmazon, name: "Amazon" },
  { icon: SiInfosys, name: "Infosys" },
  { icon: SiWipro, name: "Wipro" },
];

const HeroSection = () => {
  const { user, isAuthorized } = useAuth();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const primaryCta = { to: "/job/getall", label: "Browse Jobs" };
  let secondaryCta = { to: "/register", label: "Get Started Free" };
  if (isAuthorized) {
    secondaryCta = user?.role === "Employer"
      ? { to: "/job/post", label: "Post a Job" }
      : { to: "/applications/me", label: "My Applications" };
  }

  const onSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/job/getall?search=${encodeURIComponent(query)}` : "/job/getall");
  };

  return (
    <section className="hero">
      <div className="hero-bg-glow hero-glow-1" />
      <div className="hero-bg-glow hero-glow-2" />

      <div className="hero-content">
        <p className="hero-badge">✨ The Smarter Way to Find Work</p>
        <h1>
          Your Next <span className="hero-gradient">Career Move</span> Starts Here
        </h1>
        <p className="hero-sub">
          Whether you're looking for your dream job or the perfect candidate —
          we connect talent with opportunity across the globe.
        </p>

        <form className="hero-quick-search" onSubmit={onSearch} role="search">
          <FiSearch />
          <input
            type="text"
            placeholder="Try 'React Developer' or 'Remote'"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search jobs"
          />
          <button type="submit">Search</button>
        </form>

        <div className="hero-ctas">
          <Link to={primaryCta.to} className="hero-btn hero-btn--primary">
            {primaryCta.label}
          </Link>
          <Link to={secondaryCta.to} className="hero-btn hero-btn--outline">
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      <div className="hero-stats reveal">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <div className="hero-stat" key={i}>
            <div className="hero-stat-icon"><Icon /></div>
            <div>
              <p className="hero-stat-value">{value}</p>
              <p className="hero-stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-trust reveal">
        <p>Trusted by professionals at</p>
        <div className="hero-trust-logos">
          {trusted.map(({ icon: Icon, name }, i) => (
            <div className="hero-trust-item" key={i}>
              <Icon /> <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
