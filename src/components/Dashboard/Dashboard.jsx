import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase, FaCheckCircle, FaRegClock, FaStar, FaTimesCircle,
  FaUserTie, FaBookmark, FaRegFileAlt, FaBullhorn, FaRocket,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { SectionTitle, Skeleton, Tooltip } from "../../ui";
import MiniLineChart from "./MiniLineChart";
import * as api from "../../api";
import "./Dashboard.css";

const statusMeta = {
  Pending: { icon: FaRegClock, color: "#f59e0b" },
  Reviewed: { icon: FaRegFileAlt, color: "#06b6d4" },
  Shortlisted: { icon: FaStar, color: "#4f46e5" },
  Rejected: { icon: FaTimesCircle, color: "#ef4444" },
  Hired: { icon: FaCheckCircle, color: "#10b981" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [series, setSeries] = useState([]);
  const [activity, setActivity] = useState([]);
  const [topCats, setTopCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.getStats().catch(() => ({ data: { stats: null } })),
      api.getApplicationsOverTime(14).catch(() => ({ data: { series: [] } })),
      api.getRecentActivity().catch(() => ({ data: { activity: [] } })),
      api.getTopCategories(6).catch(() => ({ data: { categories: [] } })),
    ]).then(([s, ot, a, c]) => {
      if (cancelled) return;
      setStats(s.data.stats);
      setSeries(ot.data.series || []);
      setActivity(a.data.activity || []);
      setTopCats(c.data.categories || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const isEmployer = user?.role === "Employer";

  const tips = isEmployer
    ? [
        { icon: FaBullhorn, text: "Featured jobs get 3× more views.", link: "/job/me" },
        { icon: FaRegFileAlt, text: "Respond quickly to applicants.", link: "/applications/me" },
        { icon: FaRocket, text: "Add skills & tags for better visibility.", link: "/job/post" },
      ]
    : [
        { icon: FaUserTie, text: "Complete your profile to stand out.", link: "/profile" },
        { icon: FaBookmark, text: "Save jobs to apply later.", link: "/jobs/saved" },
        { icon: FaStar, text: "Customise your cover letter per application.", link: "/job/getall" },
      ];

  return (
    <section className="dashboard">
      <div className="dash-inner">
        <SectionTitle sub={`Welcome back, ${user?.name || "there"}!`}>
          {isEmployer ? "Employer Dashboard" : "My Dashboard"}
        </SectionTitle>

        {loading ? (
          <>
            <div className="dash-tiles">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="dash-tile"><Skeleton height={58} width={58} radius={12} /><Skeleton width="60%" height={24} /></div>
              ))}
            </div>
            <div className="dash-status-card"><Skeleton width="40%" height={24} /><Skeleton height={120} /></div>
          </>
        ) : !stats ? (
          <p>Unable to load stats.</p>
        ) : (
          <>
            <div className="dash-tiles">
              {isEmployer ? (
                <>
                  <DashTile icon={FaBriefcase} label="Active Jobs" value={stats.activeJobs} color="#4f46e5" to="/job/me" />
                  <DashTile icon={FaBriefcase} label="Total Jobs" value={stats.totalJobs} color="#06b6d4" to="/job/me" />
                  <DashTile icon={FaUserTie} label="Applications" value={stats.totalApplications} color="#10b981" to="/applications/me" />
                  <DashTile icon={FaStar} label="Shortlisted" value={stats.byStatus?.Shortlisted || 0} color="#f59e0b" to="/applications/me" />
                </>
              ) : (
                <>
                  <DashTile icon={FaRegFileAlt} label="My Applications" value={stats.totalApplications} color="#4f46e5" to="/applications/me" />
                  <DashTile icon={FaBookmark} label="Saved Jobs" value={stats.savedJobsCount} color="#06b6d4" to="/jobs/saved" />
                  <DashTile icon={FaStar} label="Shortlisted" value={stats.byStatus?.Shortlisted || 0} color="#f59e0b" to="/applications/me" />
                  <DashTile icon={FaCheckCircle} label="Hired" value={stats.byStatus?.Hired || 0} color="#10b981" to="/applications/me" />
                </>
              )}
            </div>

            <div className="dash-grid">
              <div className="dash-card dash-card--chart">
                <div className="dash-card-head">
                  <h3>{isEmployer ? "Applications received (14d)" : "Applications sent (14d)"}</h3>
                </div>
                <MiniLineChart series={series} height={180} />
              </div>

              <div className="dash-card">
                <div className="dash-card-head"><h3>By status</h3></div>
                <div className="dash-status-grid">
                  {Object.entries(stats.byStatus).map(([status, count]) => {
                    const meta = statusMeta[status] || { icon: FaRegClock, color: "#64748b" };
                    const Icon = meta.icon;
                    return (
                      <div className="dash-status-item" key={status}>
                        <div className="dash-status-icon" style={{ background: `${meta.color}15`, color: meta.color }}>
                          <Icon />
                        </div>
                        <div>
                          <p className="dash-status-count">{count}</p>
                          <p className="dash-status-label">{status}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="dash-card dash-card--activity">
                <div className="dash-card-head"><h3>Recent activity</h3></div>
                {activity.length === 0 ? (
                  <p className="dash-empty-inline">No activity yet.</p>
                ) : (
                  <ul className="dash-activity-list">
                    {activity.map((item) => (
                      <li key={item._id} className="dash-activity-item">
                        <span
                          className="dash-activity-dot"
                          style={{ background: statusMeta[item.status]?.color || "#64748b" }}
                        />
                        <div>
                          <p className="dash-activity-title">
                            {isEmployer
                              ? <><strong>{item.applicantName}</strong> — {item.status} for {item.jobTitle}</>
                              : <>Your application to <strong>{item.jobTitle}</strong> is {item.status}</>}
                          </p>
                          <p className="dash-activity-time">{new Date(item.at).toLocaleString()}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="dash-card dash-card--tips">
                <div className="dash-card-head"><h3>Tips for you</h3></div>
                <div className="dash-tips">
                  {tips.map(({ icon: Icon, text, link }, i) => (
                    <Link to={link} className="dash-tip" key={i}>
                      <Icon />
                      <span>{text}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {!isEmployer && topCats.length > 0 && (
                <div className="dash-card dash-card--cats">
                  <div className="dash-card-head"><h3>Trending categories</h3></div>
                  <div className="dash-cats">
                    {topCats.map((c) => (
                      <Tooltip key={c.category} content={`${c.count} open`}>
                        <Link to={`/job/getall?category=${encodeURIComponent(c.category)}`} className="dash-cat">
                          <span>{c.category}</span>
                          <span className="dash-cat-count">{c.count}</span>
                        </Link>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="dash-cta">
              {isEmployer ? (
                <Link to="/job/post" className="dash-btn">+ Post a New Job</Link>
              ) : (
                <Link to="/job/getall" className="dash-btn">Browse More Jobs</Link>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const DashTile = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to} className="dash-tile">
    <div className="dash-tile-icon" style={{ background: `${color}15`, color }}>
      <Icon />
    </div>
    <div className="dash-tile-content">
      <p className="dash-tile-value">{value}</p>
      <p className="dash-tile-label">{label}</p>
    </div>
  </Link>
);

export default Dashboard;
