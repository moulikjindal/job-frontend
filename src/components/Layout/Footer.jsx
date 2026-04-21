import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter, FaFacebookF } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <Link to="/" className="footer-logo">
            Job<span>.Com</span>
          </Link>
          <p>Your next career move starts here. Connecting talent with opportunity across the globe.</p>
          <div className="footer-socials">
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Github"><FaGithub /></a>
            <a href="#" aria-label="Instagram"><RiInstagramFill /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>For Job Seekers</h4>
          <Link to="/job/getall">Browse Jobs</Link>
          <Link to="/applications/me">My Applications</Link>
          <Link to="/jobs/saved">Saved Jobs</Link>
          <Link to="/profile">My Profile</Link>
        </div>
        <div className="footer-col">
          <h4>For Employers</h4>
          <Link to="/job/post">Post a Job</Link>
          <Link to="/job/me">Manage Jobs</Link>
          <Link to="/applications/me">Applicants</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} Job.Com — All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
