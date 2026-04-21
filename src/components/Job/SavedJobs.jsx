import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import { SectionTitle } from "../../ui";
import "./Jobs.css";

const SavedJobs = () => {
  const { savedJobs, loading, toggle } = useSavedJobs();

  return (
    <section className="jobs-page">
      <div className="jobs-inner">
        <SectionTitle sub="Jobs you've bookmarked for later">Saved Jobs</SectionTitle>
        {loading ? (
          <div className="jobs-loading">
            <div className="spinner" />
            <p>Loading saved jobs...</p>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="jobs-empty">
            <p className="jobs-empty-icon">🔖</p>
            <h3>No saved jobs yet</h3>
            <p>Tap the bookmark icon on a job to save it for later.</p>
            <Link to="/job/getall" className="jobs-filter-btn" style={{ marginTop: 20, display: "inline-block" }}>
              Browse Jobs
            </Link>
          </div>
        ) : (
          <>
            <p className="jobs-count">{savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}</p>
            <div className="jobs-grid">
              {savedJobs.map((job) => (
                <div className="job-card" key={job._id}>
                  <div className="job-card-top">
                    <div>
                      <p className="job-title">{job.title}</p>
                      <p className="job-company">{job.postedBy?.companyName || job.postedBy?.name || "Company"}</p>
                    </div>
                    <button
                      className="job-save-btn saved"
                      onClick={() => toggle(job._id)}
                      title="Remove from saved"
                    >
                      <FaBookmark />
                    </button>
                  </div>
                  <p className="job-category">{job.category}</p>
                  <p className="job-country"><FiMapPin /> {job.city}, {job.country}</p>
                  {job.fixedSalary ? (
                    <p className="job-salary">₹{Number(job.fixedSalary).toLocaleString()}</p>
                  ) : job.salaryFrom && job.salaryTo ? (
                    <p className="job-salary">₹{Number(job.salaryFrom).toLocaleString()} - ₹{Number(job.salaryTo).toLocaleString()}</p>
                  ) : null}
                  <Link to={`/job/${job._id}`} className="job-link">View Details</Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SavedJobs;
