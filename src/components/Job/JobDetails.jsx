import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  FiMapPin, FiCalendar, FiBriefcase, FiTag, FiShare2, FiEye, FiCheckCircle,
} from "react-icons/fi";
import { FaBookmark, FaRegBookmark, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useJobDetail } from "../../hooks/useJobs";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import { useApplications } from "../../hooks/useApplications";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { useCopy } from "../../hooks/useCopy";
import * as api from "../../api";
import { Badge, EmptyState } from "../../ui";
import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const { isAuthorized, user } = useAuth();
  const { job, loading, error } = useJobDetail(id);
  const { isSaved, toggle } = useSavedJobs();
  const { applications } = useApplications(user?.role === "Job Seeker" ? "Job Seeker" : null);
  const { add: addRecent, items: recent } = useRecentlyViewed();
  const copy = useCopy();

  const [similar, setSimilar] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (!id) return;
    api.recordJobView(id).then(({ data }) => setViews(data.viewCount || 0)).catch(() => {});
    setLoadingSimilar(true);
    api.getSimilarJobs(id, 4)
      .then(({ data }) => setSimilar(data.jobs || []))
      .catch(() => {})
      .finally(() => setLoadingSimilar(false));
  }, [id]);

  useEffect(() => {
    if (job?._id) addRecent(job);
  }, [job, addRecent]);

  if (error) return <Navigate to="/notfound-404" replace />;

  if (loading || !job) {
    return (
      <section className="job-detail">
        <div className="detail-loading">
          <div className="spinner" />
          <p>Loading job details...</p>
        </div>
      </section>
    );
  }

  const isOwner = String(job.postedBy?._id || job.postedBy) === String(user?._id);
  const alreadyApplied = applications.some((a) => (a.jobId?._id || a.jobId) === job._id);
  const canApply = isAuthorized && user?.role === "Job Seeker" && !isOwner && !job.expired && !alreadyApplied;
  const saved = isSaved(job._id);

  const shareJob = async () => {
    const url = `${window.location.origin}/job/${job._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: job.title, url }); return; } catch { /* fall-through */ }
    }
    copy(url, "Job link copied!");
  };

  const displayedViews = Math.max(views, job.viewCount || 0);

  return (
    <section className="job-detail">
      <div className="detail-inner">
        <div className="detail-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/job/getall">Jobs</Link>
          <span>/</span>
          <span className="detail-breadcrumb-current">{job.title}</span>
        </div>

        <div className="detail-card">
          <div className="detail-header">
            <div>
              <div className="detail-title-row">
                <h1>{job.title}</h1>
                {job.featured && <Badge variant="featured"><FaStar /> Featured</Badge>}
                {job.expired && <Badge variant="danger">Expired</Badge>}
                {job.isRemote && <Badge variant="success">Remote</Badge>}
                {alreadyApplied && <Badge variant="info"><FiCheckCircle /> Applied</Badge>}
              </div>
              {job.postedBy && (
                <Link to={`/company/${job.postedBy._id || job.postedBy}`} className="detail-company">
                  {job.postedBy?.companyName || job.postedBy?.name || "Company"}
                </Link>
              )}
              <div className="detail-meta">
                <span><FiMapPin /> {job.city}, {job.country}</span>
                <span><FiTag /> {job.category}</span>
                {job.employmentType && <span><FiBriefcase /> {job.employmentType}</span>}
                <span><FiCalendar /> {new Date(job.jobPostedOn).toLocaleDateString()}</span>
                <span><FiEye /> {displayedViews} view{displayedViews !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <div className="detail-top-actions">
              <button className="detail-icon-btn" onClick={shareJob} title="Share" aria-label="Share">
                <FiShare2 />
              </button>
              {isAuthorized && user?.role === "Job Seeker" && (
                <button
                  className={`detail-save ${saved ? "saved" : ""}`}
                  onClick={() => toggle(job._id)}
                  title={saved ? "Remove from saved" : "Save job"}
                >
                  {saved ? <FaBookmark /> : <FaRegBookmark />}
                  <span>{saved ? "Saved" : "Save"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="detail-salary-row">
            {job.fixedSalary ? (
              <span className="detail-salary">₹{Number(job.fixedSalary).toLocaleString()}</span>
            ) : job.salaryFrom && job.salaryTo ? (
              <span className="detail-salary">
                ₹{Number(job.salaryFrom).toLocaleString()} - ₹{Number(job.salaryTo).toLocaleString()}
              </span>
            ) : (
              <span className="detail-salary detail-salary--muted">Salary not disclosed</span>
            )}
            {job.experienceLevel && <span className="detail-chip">{job.experienceLevel} Level</span>}
          </div>

          <div className="detail-section">
            <h3>Job Description</h3>
            <p>{job.description}</p>
          </div>

          <div className="detail-section">
            <h3>Location</h3>
            <p>{job.location}</p>
          </div>

          {job.skills?.length > 0 && (
            <div className="detail-section">
              <h3>Skills</h3>
              <div className="detail-skills">
                {job.skills.map((s) => <span key={s} className="detail-chip">{s}</span>)}
              </div>
            </div>
          )}

          {job.tags?.length > 0 && (
            <div className="detail-section">
              <h3>Tags</h3>
              <div className="detail-skills">
                {job.tags.map((t) => <span key={t} className="detail-chip detail-chip--tag">#{t}</span>)}
              </div>
            </div>
          )}

          <div className="detail-actions">
            {!isAuthorized ? (
              <Link to="/login" state={{ from: `/job/${job._id}` }} className="detail-apply">
                Log in to Apply
              </Link>
            ) : canApply ? (
              <Link to={`/application/${job._id}`} className="detail-apply">Apply Now</Link>
            ) : alreadyApplied ? (
              <button className="detail-apply detail-apply--ghost" disabled>You've already applied</button>
            ) : isOwner ? (
              <Link to="/job/me" className="detail-apply detail-apply--ghost">Manage this Job</Link>
            ) : job.expired ? (
              <button className="detail-apply detail-apply--ghost" disabled>Applications Closed</button>
            ) : null}
            <button className="detail-apply detail-apply--ghost detail-apply--share" onClick={() => shareJob()}>
              <FiShare2 /> Share
            </button>
          </div>
        </div>

        {similar.length > 0 && !loadingSimilar && (
          <div className="detail-similar">
            <h3>Similar jobs you might like</h3>
            <div className="detail-similar-grid">
              {similar.map((s) => (
                <Link key={s._id} to={`/job/${s._id}`} className="detail-similar-card">
                  <p className="ds-title">{s.title}</p>
                  <p className="ds-company">{s.postedBy?.companyName || s.postedBy?.name || "Company"}</p>
                  <p className="ds-loc"><FiMapPin /> {s.city}, {s.country}</p>
                  {s.fixedSalary
                    ? <p className="ds-salary">₹{Number(s.fixedSalary).toLocaleString()}</p>
                    : s.salaryFrom && s.salaryTo
                    ? <p className="ds-salary">₹{Number(s.salaryFrom).toLocaleString()}–₹{Number(s.salaryTo).toLocaleString()}</p>
                    : null}
                </Link>
              ))}
            </div>
          </div>
        )}

        {recent.filter((r) => r._id !== job._id).length > 0 && (
          <div className="detail-recent">
            <h3>Recently viewed</h3>
            <div className="detail-recent-strip">
              {recent.filter((r) => r._id !== job._id).map((r) => (
                <Link to={`/job/${r._id}`} key={r._id} className="detail-recent-chip">
                  <span className="ds-title">{r.title}</span>
                  <span className="ds-company">{r.companyName || "Company"}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {similar.length === 0 && !loadingSimilar && (
          <EmptyState icon="🔍" title="No similar jobs yet" message="As more jobs come in, we'll suggest related opportunities here." />
        )}
      </div>
    </section>
  );
};

export default JobDetails;
