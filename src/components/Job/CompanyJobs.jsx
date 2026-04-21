import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import * as api from "../../api";
import { SectionTitle, EmptyState, Avatar, Badge } from "../../ui";
import FullPageLoader from "../Common/FullPageLoader";
import "./Jobs.css";

const CompanyJobs = () => {
  const { userId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.getPublicUser(userId).catch(() => null),
      api.getJobsByCompany(userId).catch(() => ({ data: { jobs: [] } })),
    ]).then(([u, j]) => {
      if (cancelled) return;
      setCompany(u?.data?.user || null);
      setJobs(j?.data?.jobs || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <FullPageLoader message="Loading company..." />;
  if (!company) return <EmptyState icon="🏢" title="Company not found" message="This company profile is unavailable." />;

  return (
    <section className="jobs-page">
      <div className="jobs-inner">
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Avatar name={company.companyName || company.name} color={company.avatarColor} size={72} />
          <div>
            <SectionTitle sub={`${jobs.length} open position${jobs.length !== 1 ? "s" : ""}`}>
              {company.companyName || company.name}
            </SectionTitle>
            {company.companyWebsite && (
              <a href={company.companyWebsite} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: 600 }}>
                {company.companyWebsite}
              </a>
            )}
          </div>
        </div>

        {jobs.length === 0 ? (
          <EmptyState icon="💼" title="No active listings" message="This company isn't hiring at the moment." />
        ) : (
          <div className="jobs-grid jobs-grid--grid">
            {jobs.map((job) => (
              <div className="job-card" key={job._id}>
                {job.featured && <Badge variant="featured" className="job-card-featured">Featured</Badge>}
                <div className="job-card-top">
                  <div className="job-card-head">
                    <Link to={`/job/${job._id}`} className="job-title">{job.title}</Link>
                    <p className="job-company">{job.category}</p>
                  </div>
                </div>
                <div className="job-pills">
                  {job.employmentType && <span className="job-pill">{job.employmentType}</span>}
                  {job.isRemote && <span className="job-pill job-pill--remote">Remote</span>}
                </div>
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
        )}
      </div>
    </section>
  );
};

export default CompanyJobs;
