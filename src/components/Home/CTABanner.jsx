import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./CTABanner.css";

const CTABanner = () => {
  const { user, isAuthorized } = useAuth();

  let heading = "Ready to Land Your Dream Job?";
  let sub = "Thousands of companies are hiring right now. Don't miss out.";
  let to = "/register";
  let label = "Join Now — It's Free";

  if (isAuthorized) {
    if (user?.role === "Employer") {
      heading = "Find Your Next Star Employee";
      sub = "Post jobs, review applications, and hire top talent — all in one place.";
      to = "/job/post";
      label = "Post a Job Now";
    } else {
      to = "/job/getall";
      label = "Explore Jobs";
    }
  }

  return (
    <section className="cta-banner">
      <div className="cta-glow" />
      <div className="cta-inner">
        <h2>{heading}</h2>
        <p>{sub}</p>
        <Link to={to} className="cta-btn">{label}</Link>
      </div>
    </section>
  );
};

export default CTABanner;
