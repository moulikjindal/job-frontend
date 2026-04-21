import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <section className="notfound">
    <div className="nf-content">
      <p className="nf-code">404</p>
      <h1>Page not found</h1>
      <p className="nf-sub">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="nf-actions">
        <Link to="/" className="nf-btn nf-btn--primary">Go Home</Link>
        <Link to="/job/getall" className="nf-btn nf-btn--ghost">Browse Jobs</Link>
      </div>
    </div>
  </section>
);

export default NotFound;
