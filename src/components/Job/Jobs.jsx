import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiSearch, FiMapPin, FiBookmark, FiShare2, FiGrid, FiList, FiClock,
  FiSliders, FiX, FiCheckCircle,
} from "react-icons/fi";
import { FaBookmark, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useJobs } from "../../hooks/useJobs";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import { useApplications } from "../../hooks/useApplications";
import { useDebounce } from "../../hooks/useDebounce";
import { useCopy } from "../../hooks/useCopy";
import { useRecentSearches } from "../../hooks/useRecentSearches";
import { JOB_CATEGORIES } from "../../constants";
import {
  SectionTitle, Chip, Badge, Switch, RangeSlider, Skeleton, EmptyState, Highlight,
} from "../../ui";
import "./Jobs.css";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead"];
const DATE_OPTIONS = [
  { value: "", label: "Any time" },
  { value: "1", label: "Last 24h" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];
const MIN_SAL = 0;
const MAX_SAL = 5_000_000;

const fmtSalary = (v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Number(v).toLocaleString()}`);

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthorized, user } = useAuth();
  const { jobs, meta, loading, error, params, setParams } = useJobs(Object.fromEntries(searchParams));
  const { isSaved, toggle } = useSavedJobs();
  const { applications } = useApplications(user?.role === "Job Seeker" ? "Job Seeker" : null);
  const { items: recentSearches, add: addRecent, remove: removeRecent, clear: clearRecent } = useRecentSearches();
  const copy = useCopy();

  const appliedJobIds = useMemo(
    () => new Set(applications.map((a) => a.jobId?._id || a.jobId)),
    [applications]
  );

  // Local controlled state
  const [search, setSearch] = useState(params.search || "");
  const [category, setCategory] = useState(params.category || "");
  const [country, setCountry] = useState(params.country || "");
  const [city, setCity] = useState(params.city || "");
  const [employmentType, setEmploymentType] = useState(params.employmentType || "");
  const [experienceLevel, setExperienceLevel] = useState(params.experienceLevel || "");
  const [postedWithin, setPostedWithin] = useState(params.postedWithin || "");
  const [isRemote, setIsRemote] = useState(params.remote === "true");
  const [salaryRange, setSalaryRange] = useState([
    Number(params.minSalary) || MIN_SAL,
    Number(params.maxSalary) || MAX_SAL,
  ]);
  const [sort, setSort] = useState(params.sort || "newest");
  const [view, setView] = useState(() => localStorage.getItem("jobs:view") || "grid");
  const [showMore, setShowMore] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => { localStorage.setItem("jobs:view", view); }, [view]);

  const debouncedSearch = useDebounce(search, 400);

  // Keyboard shortcut: "/" focuses the search input
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea" && tag !== "select") {
        e.preventDefault();
        document.querySelector(".jobs-search input")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sync local -> URL + API params
  useEffect(() => {
    const next = {
      search: debouncedSearch || undefined,
      category: category || undefined,
      country: country || undefined,
      city: city || undefined,
      employmentType: employmentType || undefined,
      experienceLevel: experienceLevel || undefined,
      postedWithin: postedWithin || undefined,
      remote: isRemote ? "true" : undefined,
      minSalary: salaryRange[0] > MIN_SAL ? String(salaryRange[0]) : undefined,
      maxSalary: salaryRange[1] < MAX_SAL ? String(salaryRange[1]) : undefined,
      sort,
      page: String(params.page || 1),
      limit: String(params.limit || 12),
    };
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined && v !== ""));
    setParams((p) => ({ ...p, ...next, page: 1 }));
    setSearchParams(clean, { replace: true });
    // eslint-disable-next-line
  }, [debouncedSearch, category, country, city, employmentType, experienceLevel, postedWithin, isRemote, salaryRange, sort]);

  const resetFilters = () => {
    setSearch(""); setCategory(""); setCountry(""); setCity("");
    setEmploymentType(""); setExperienceLevel(""); setPostedWithin("");
    setIsRemote(false); setSalaryRange([MIN_SAL, MAX_SAL]); setSort("newest");
  };

  const activeFilters = [
    category && { id: "category", label: category, clear: () => setCategory("") },
    city && { id: "city", label: `City: ${city}`, clear: () => setCity("") },
    country && { id: "country", label: `Country: ${country}`, clear: () => setCountry("") },
    employmentType && { id: "et", label: employmentType, clear: () => setEmploymentType("") },
    experienceLevel && { id: "xp", label: `${experienceLevel} level`, clear: () => setExperienceLevel("") },
    postedWithin && { id: "pw", label: `Last ${postedWithin}d`, clear: () => setPostedWithin("") },
    isRemote && { id: "rm", label: "Remote only", clear: () => setIsRemote(false) },
    (salaryRange[0] > MIN_SAL || salaryRange[1] < MAX_SAL) && {
      id: "sal", label: `${fmtSalary(salaryRange[0])}–${fmtSalary(salaryRange[1])}`,
      clear: () => setSalaryRange([MIN_SAL, MAX_SAL]),
    },
  ].filter(Boolean);

  const handleSave = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthorized) return toast.error("Please log in to save jobs");
    if (user?.role !== "Job Seeker") return toast.error("Only job seekers can save jobs");
    await toggle(jobId);
  };

  const handleShare = async (e, job) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/job/${job._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: job.title, url });
        return;
      } catch { /* fall through to copy */ }
    }
    copy(url, "Job link copied!");
  };

  const goto = (page) => setParams((p) => ({ ...p, page }));

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      addRecent(e.target.value);
      setShowRecent(false);
    }
  };

  return (
    <section className="jobs-page">
      <div className="jobs-inner">
        <SectionTitle sub="Browse and apply to the latest openings">All Available Jobs</SectionTitle>

        <div className="jobs-filters">
          <div className="jobs-search-wrap">
            <div className="jobs-search">
              <FiSearch className="jobs-search-icon" />
              <input
                type="text"
                placeholder="Search by title, skills or location… (press /)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowRecent(true)}
                onBlur={() => setTimeout(() => setShowRecent(false), 120)}
                onKeyDown={onSearchKeyDown}
                aria-label="Search jobs"
              />
              {search && (
                <button className="jobs-search-clear" onClick={() => setSearch("")} title="Clear">
                  <FiX />
                </button>
              )}
            </div>
            {showRecent && recentSearches.length > 0 && (
              <div className="jobs-recent">
                <div className="jobs-recent-head">
                  <span><FiClock /> Recent searches</span>
                  <button onClick={clearRecent}>Clear all</button>
                </div>
                {recentSearches.map((t) => (
                  <div key={t} className="jobs-recent-item">
                    <button
                      className="jobs-recent-term"
                      onMouseDown={(e) => { e.preventDefault(); setSearch(t); addRecent(t); }}
                    >
                      <FiSearch /> {t}
                    </button>
                    <button className="jobs-recent-remove" onClick={() => removeRecent(t)} aria-label="Remove">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="jobs-select" aria-label="Category">
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="jobs-select" aria-label="Sort">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="salaryHigh">Salary: High → Low</option>
            <option value="salaryLow">Salary: Low → High</option>
            <option value="popular">Most Viewed</option>
          </select>

          <button
            className={`jobs-more-btn ${showMore ? "active" : ""}`}
            onClick={() => setShowMore((v) => !v)}
          >
            <FiSliders /> {showMore ? "Hide filters" : "More filters"}
          </button>

          <div className="jobs-view-toggle" role="group" aria-label="View mode">
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
              aria-label="Grid view" title="Grid view"
            ><FiGrid /></button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
              aria-label="List view" title="List view"
            ><FiList /></button>
          </div>
        </div>

        {showMore && (
          <div className="jobs-more-panel">
            <input
              className="jobs-text-filter"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              className="jobs-text-filter"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="jobs-select">
              <option value="">Any employment type</option>
              {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="jobs-select">
              <option value="">Any experience</option>
              {EXPERIENCE_LEVELS.map((t) => <option key={t} value={t}>{t} level</option>)}
            </select>
            <select value={postedWithin} onChange={(e) => setPostedWithin(e.target.value)} className="jobs-select">
              {DATE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <Switch label="Remote only" checked={isRemote} onChange={setIsRemote} id="remote-toggle" />
            <div className="jobs-range-wrap">
              <RangeSlider
                min={MIN_SAL}
                max={MAX_SAL}
                step={10_000}
                value={salaryRange}
                onChange={setSalaryRange}
                label="Salary range"
              />
            </div>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="jobs-active-chips">
            {activeFilters.map((f) => (
              <Chip key={f.id} onRemove={f.clear} active>{f.label}</Chip>
            ))}
            <button className="jobs-reset" onClick={resetFilters}>Clear all</button>
          </div>
        )}

        {loading ? (
          <div className={`jobs-grid jobs-grid--${view}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`job-card job-card--skeleton`}>
                <Skeleton width="70%" height={22} />
                <Skeleton width="40%" height={14} />
                <Skeleton width="50%" height={18} radius={20} />
                <Skeleton width="60%" height={14} />
                <Skeleton width="35%" height={18} />
                <Skeleton width="100%" height={40} radius={12} />
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title="Something went wrong"
            message={error}
            action={<button className="jobs-filter-btn" onClick={() => window.location.reload()}>Retry</button>}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No Jobs Found"
            message={activeFilters.length > 0 ? "Try adjusting your search or filters." : "Check back soon — new jobs are posted daily."}
            action={activeFilters.length > 0 && <button className="jobs-filter-btn" onClick={resetFilters}>Reset filters</button>}
          />
        ) : (
          <>
            <p className="jobs-count">
              {meta.total} job{meta.total !== 1 ? "s" : ""} found
              {debouncedSearch && <> for "<strong>{debouncedSearch}</strong>"</>}
            </p>
            <div className={`jobs-grid jobs-grid--${view}`}>
              {jobs.map((job) => {
                const saved = isSaved(job._id);
                const applied = appliedJobIds.has(job._id);
                const showFeatured = job.featured;
                return (
                  <div className={`job-card ${showFeatured ? "job-card--featured" : ""}`} key={job._id}>
                    {showFeatured && <Badge variant="featured" className="job-card-featured"><FaStar /> Featured</Badge>}
                    <div className="job-card-top">
                      <div className="job-card-head">
                        <Link to={`/job/${job._id}`} className="job-title">
                          <Highlight text={job.title} query={debouncedSearch} />
                        </Link>
                        <p className="job-company">
                          <Highlight
                            text={job.postedBy?.companyName || job.postedBy?.name || "Company"}
                            query={debouncedSearch}
                          />
                        </p>
                      </div>
                      <div className="job-card-actions">
                        <button
                          className="job-card-iconbtn"
                          onClick={(e) => handleShare(e, job)}
                          title="Share job" aria-label="Share job"
                        ><FiShare2 /></button>
                        {isAuthorized && user?.role === "Job Seeker" && (
                          <button
                            className={`job-card-iconbtn ${saved ? "saved" : ""}`}
                            onClick={(e) => handleSave(e, job._id)}
                            title={saved ? "Remove from saved" : "Save job"}
                            aria-label="Save job"
                          >
                            {saved ? <FaBookmark /> : <FiBookmark />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="job-pills">
                      <span className="job-pill">{job.category}</span>
                      {job.employmentType && <span className="job-pill">{job.employmentType}</span>}
                      {job.isRemote && <span className="job-pill job-pill--remote">Remote</span>}
                    </div>
                    <p className="job-country"><FiMapPin /> {job.city}, {job.country}</p>
                    {job.fixedSalary ? (
                      <p className="job-salary">₹{Number(job.fixedSalary).toLocaleString()}</p>
                    ) : job.salaryFrom && job.salaryTo ? (
                      <p className="job-salary">₹{Number(job.salaryFrom).toLocaleString()} - ₹{Number(job.salaryTo).toLocaleString()}</p>
                    ) : (
                      <p className="job-salary job-salary--muted">Salary not disclosed</p>
                    )}
                    {applied && (
                      <Badge variant="success" className="job-applied">
                        <FiCheckCircle /> You've applied
                      </Badge>
                    )}
                    <Link to={`/job/${job._id}`} className="job-link">View Details</Link>
                  </div>
                );
              })}
            </div>

            {meta.pages > 1 && (
              <div className="jobs-pagination">
                <button disabled={meta.page <= 1} onClick={() => goto(meta.page - 1)}>← Prev</button>
                <span>Page {meta.page} of {meta.pages}</span>
                <button disabled={meta.page >= meta.pages} onClick={() => goto(meta.page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Jobs;
