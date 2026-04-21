import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiGlobe, FiLinkedin, FiGithub, FiTwitter, FiMapPin } from "react-icons/fi";
import * as api from "../../api";
import { Avatar, Badge, EmptyState, SectionTitle } from "../../ui";
import FullPageLoader from "../Common/FullPageLoader";
import "./Profile.css";

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.getPublicUser(id);
        if (cancelled) return;
        setUser(data.user);
        if (data.user?.role === "Employer") {
          api.getJobsByCompany(id)
            .then(({ data: j }) => !cancelled && setJobs(j.jobs || []))
            .catch(() => {});
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <FullPageLoader message="Loading profile..." />;
  if (!user) return <EmptyState icon="👤" title="Profile not found" message="This user does not exist." action={<Link to="/" className="jobs-filter-btn">Go home</Link>} />;

  return (
    <section className="profile-page">
      <div className="profile-inner">
        <SectionTitle sub={user.role === "Employer" ? user.companyName || "Company profile" : "Public profile"}>
          {user.name}
        </SectionTitle>

        <div className="profile-grid">
          <div className="profile-card">
            <Avatar name={user.name} color={user.avatarColor} size={96} />
            <h3>{user.name}</h3>
            <p className="profile-role">{user.role}</p>
            {user.headline && <p className="profile-headline">{user.headline}</p>}
            {user.location && <p className="profile-email"><FiMapPin /> {user.location}</p>}
            {user.role === "Job Seeker" && (
              <Badge variant={user.availableForWork ? "success" : "muted"} style={{ marginTop: 12 }}>
                {user.availableForWork ? "Open to work" : "Not currently looking"}
              </Badge>
            )}
            <div className="profile-links">
              {user.portfolioUrl && <a href={user.portfolioUrl} target="_blank" rel="noreferrer" title="Portfolio"><FiGlobe /></a>}
              {user.linkedinUrl && <a href={user.linkedinUrl} target="_blank" rel="noreferrer" title="LinkedIn"><FiLinkedin /></a>}
              {user.githubUrl && <a href={user.githubUrl} target="_blank" rel="noreferrer" title="GitHub"><FiGithub /></a>}
              {user.twitterUrl && <a href={user.twitterUrl} target="_blank" rel="noreferrer" title="Twitter"><FiTwitter /></a>}
            </div>
          </div>

          <div className="profile-forms">
            {user.bio && (
              <div className="profile-form" style={{ gap: 10 }}>
                <h4>About</h4>
                <p style={{ color: "var(--gray-1)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{user.bio}</p>
              </div>
            )}
            {user.role === "Job Seeker" && user.skills?.length > 0 && (
              <div className="profile-form" style={{ gap: 12 }}>
                <h4>Skills</h4>
                <div className="detail-skills">
                  {user.skills.map((s) => <span key={s} className="detail-chip">{s}</span>)}
                </div>
              </div>
            )}
            {user.role === "Employer" && (
              <div className="profile-form" style={{ gap: 10 }}>
                <h4>Open Jobs</h4>
                {jobs.length === 0 ? (
                  <EmptyState icon="💼" title="No active listings" message="This company has no open positions right now." />
                ) : (
                  <div className="detail-similar-grid">
                    {jobs.map((j) => (
                      <Link to={`/job/${j._id}`} key={j._id} className="detail-similar-card">
                        <p className="ds-title">{j.title}</p>
                        <p className="ds-company">{j.category}</p>
                        <p className="ds-loc"><FiMapPin /> {j.city}, {j.country}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicProfile;
