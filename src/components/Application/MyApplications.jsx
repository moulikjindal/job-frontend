import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiMail, FiPhone, FiMapPin, FiExternalLink, FiFileText, FiSearch,
  FiDownload, FiGrid, FiList, FiClock, FiEdit3,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useApplications } from "../../hooks/useApplications";
import { useCopy } from "../../hooks/useCopy";
import { Button, Modal, SectionTitle, Confirm, Chip, Rating, Avatar, EmptyState, Badge, Tooltip } from "../../ui";
import "./MyApplications.css";

const STATUSES = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

const statusColor = {
  Pending: "#f59e0b",
  Reviewed: "#06b6d4",
  Shortlisted: "#4f46e5",
  Rejected: "#ef4444",
  Hired: "#10b981",
};

const toCsv = (rows) => {
  const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const headers = ["Name", "Email", "Phone", "Address", "Job", "Status", "Applied On", "Rating", "Notes"];
  const body = rows.map((r) => [
    r.name, r.email, r.phone, r.address,
    r.jobId?.title || "—",
    r.status || "Pending",
    r.createdAt ? new Date(r.createdAt).toISOString() : "",
    r.employerRating || 0,
    r.employerNotes || "",
  ].map(esc).join(","));
  return [headers.map(esc).join(","), ...body].join("\n");
};

const download = (filename, content, type = "text/csv;charset=utf-8") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const MyApplications = () => {
  const { user } = useAuth();
  const { applications, loading, remove, updateStatus, rate, saveNotes } = useApplications(user?.role);
  const [resumeView, setResumeView] = useState(null);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [view, setView] = useState(() => localStorage.getItem("apps:view") || "list"); // list | kanban
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [timelineFor, setTimelineFor] = useState(null);
  const [notesFor, setNotesFor] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const copy = useCopy();

  const isEmployer = user?.role === "Employer";

  React.useEffect(() => { localStorage.setItem("apps:view", view); }, [view]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return applications.filter((a) => {
      if (filter !== "All" && a.status !== filter) return false;
      if (!needle) return true;
      const hay = `${a.name} ${a.email} ${a.jobId?.title || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [applications, filter, q]);

  const grouped = useMemo(() => {
    const g = { Pending: [], Reviewed: [], Shortlisted: [], Rejected: [], Hired: [] };
    for (const a of filtered) (g[a.status] || g.Pending).push(a);
    return g;
  }, [filtered]);

  const doRemove = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try { await remove(id); toast.success("Application deleted."); }
    catch (e) { toast.error(e.response?.data?.message || "Failed to delete"); }
  };

  const onStatus = async (id, status) => {
    try { await updateStatus(id, status); toast.success("Status updated!"); }
    catch (e) { toast.error(e.response?.data?.message || "Failed to update status"); }
  };

  const onRate = async (id, rating) => {
    try { await rate(id, rating); toast.success("Rating saved."); }
    catch (e) { toast.error(e.response?.data?.message || "Failed to save rating"); }
  };

  const onSaveNotes = async () => {
    try {
      await saveNotes(notesFor._id, notesDraft);
      toast.success("Notes saved.");
      setNotesFor(null);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save notes");
    }
  };

  const openResume = (resume) => {
    if (!resume?.url) return;
    const isPdf = resume.format === "pdf" || resume.resource_type === "raw" || resume.url.toLowerCase().endsWith(".pdf");
    setResumeView({ url: resume.url, isPdf });
  };

  const exportCsv = () => {
    download(`applications-${Date.now()}.csv`, toCsv(filtered));
    toast.success(`Exported ${filtered.length} application${filtered.length !== 1 ? "s" : ""}`);
  };

  return (
    <section className="my-apps">
      <div className="ma-inner">
        <div className="ma-head">
          <SectionTitle sub={isEmployer ? "Manage and review applicants" : "Track the status of your applications"}>
            {isEmployer ? "Applications From Job Seekers" : "My Applications"}
          </SectionTitle>
          {applications.length > 0 && (
            <div className="ma-head-actions">
              {isEmployer && (
                <Button variant="secondary" onClick={exportCsv}>
                  <FiDownload /> Export CSV
                </Button>
              )}
              <div className="ma-view-toggle" role="group" aria-label="View mode">
                <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} title="List">
                  <FiList />
                </button>
                <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")} title="Pipeline">
                  <FiGrid />
                </button>
              </div>
            </div>
          )}
        </div>

        {applications.length > 0 && (
          <div className="ma-toolbar">
            <div className="ma-search">
              <FiSearch />
              <input
                type="text"
                placeholder={isEmployer ? "Search by name, email or job..." : "Search by job title..."}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="ma-filter-bar">
              {["All", ...STATUSES].map((s) => (
                <Chip
                  key={s}
                  active={filter === s}
                  onClick={() => setFilter(s)}
                >
                  {s} {s !== "All" && `(${applications.filter((a) => a.status === s).length})`}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="ma-loading"><div className="spinner" /><p>Loading applications...</p></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title={applications.length === 0 ? "No Applications Found" : `No ${filter === "All" ? "matching" : filter} applications`}
            message={
              applications.length === 0
                ? (isEmployer ? "No one has applied to your jobs yet." : "You haven't applied to any jobs yet.")
                : "Try a different filter or search term."
            }
          />
        ) : view === "kanban" ? (
          <div className="ma-kanban">
            {STATUSES.map((st) => (
              <div key={st} className="ma-col">
                <div className="ma-col-head" style={{ color: statusColor[st] }}>
                  <span className="ma-col-dot" style={{ background: statusColor[st] }} />
                  {st}
                  <span className="ma-col-count">{grouped[st].length}</span>
                </div>
                <div className="ma-col-list">
                  {grouped[st].length === 0 ? (
                    <div className="ma-col-empty">Nothing here</div>
                  ) : grouped[st].map((el) => (
                    <div key={el._id} className="ma-mini-card">
                      <div className="ma-mini-head">
                        <Avatar name={el.name} color={el.applicantID?.user?.avatarColor || "#4f46e5"} size={34} />
                        <div>
                          <p className="ma-mini-name">{el.name}</p>
                          <p className="ma-mini-job">{el.jobId?.title || "—"}</p>
                        </div>
                      </div>
                      {isEmployer && <Rating value={el.employerRating || 0} onChange={(v) => onRate(el._id, v)} size={14} />}
                      <div className="ma-mini-actions">
                        <select value={el.status} onChange={(e) => onStatus(el._id, e.target.value)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button className="ma-mini-btn" onClick={() => openResume(el.resume)} title="Resume">
                          <FiFileText />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ma-list">
            {filtered.map((el) => (
              <div className="ma-card" key={el._id}>
                <div className="ma-card-head">
                  <div className="ma-card-head-left">
                    <Avatar name={el.name} color={el.applicantID?.user?.avatarColor || "#4f46e5"} size={44} />
                    <div>
                      <h4 className="ma-card-name">{el.name}</h4>
                      {el.jobId && (
                        <p className="ma-card-job">
                          For: <strong>{el.jobId.title || "—"}</strong>
                          {el.jobId.city && ` · ${el.jobId.city}, ${el.jobId.country}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ma-card-head-right">
                    {isEmployer && <Rating value={el.employerRating || 0} onChange={(v) => onRate(el._id, v)} />}
                    <Badge variant="muted" style={{ background: `${statusColor[el.status]}22`, color: statusColor[el.status] }}>
                      {el.status || "Pending"}
                    </Badge>
                  </div>
                </div>

                <div className="ma-detail-grid">
                  <p>
                    <FiMail />
                    <button className="ma-link-btn" onClick={() => copy(el.email, "Email copied!")}>{el.email}</button>
                  </p>
                  <p><FiPhone /> {el.phone}</p>
                  <p><FiMapPin /> {el.address}</p>
                  <p className="ma-applied"><FiClock /> Applied {el.createdAt ? new Date(el.createdAt).toLocaleDateString() : "—"}</p>
                </div>

                <div className="ma-cover">
                  <p className="ma-cover-label">Cover Letter</p>
                  <p className="ma-cover-text">{el.coverLetter}</p>
                </div>

                {isEmployer && el.employerNotes && (
                  <div className="ma-notes-display">
                    <p className="ma-cover-label">Internal notes</p>
                    <p className="ma-cover-text">{el.employerNotes}</p>
                  </div>
                )}

                <div className="ma-actions">
                  <button className="ma-resume-btn" onClick={() => openResume(el.resume)}>
                    <FiFileText /> View Resume
                  </button>
                  <a href={el.resume?.url} target="_blank" rel="noreferrer" className="ma-resume-btn ma-resume-btn--ghost">
                    <FiExternalLink /> Open in New Tab
                  </a>
                  {el.statusHistory?.length > 1 && (
                    <Tooltip content="View status history">
                      <button className="ma-resume-btn ma-resume-btn--ghost" onClick={() => setTimelineFor(el)}>
                        <FiClock /> Timeline
                      </button>
                    </Tooltip>
                  )}
                  {isEmployer && (
                    <button
                      className="ma-resume-btn ma-resume-btn--ghost"
                      onClick={() => { setNotesFor(el); setNotesDraft(el.employerNotes || ""); }}
                    >
                      <FiEdit3 /> Notes
                    </button>
                  )}
                  {isEmployer ? (
                    <div className="ma-status-select">
                      <label>Status:</label>
                      <select value={el.status} onChange={(e) => onStatus(el._id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ) : (
                    <Button variant="danger" onClick={() => setConfirmDelete(el._id)}>Withdraw</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {resumeView && (
        <Modal onClose={() => setResumeView(null)}>
          {resumeView.isPdf ? (
            <iframe src={resumeView.url} title="Resume" className="ma-resume-iframe" />
          ) : (
            <img src={resumeView.url} alt="resume" className="ma-resume-img" />
          )}
          <div className="ma-modal-actions">
            <a href={resumeView.url} target="_blank" rel="noreferrer" className="ma-modal-link">
              Open in new tab ↗
            </a>
          </div>
        </Modal>
      )}

      {timelineFor && (
        <Modal onClose={() => setTimelineFor(null)}>
          <h3 className="ma-modal-title">Status timeline for {timelineFor.name}</h3>
          <ol className="ma-timeline">
            {timelineFor.statusHistory.map((h, i) => (
              <li key={i} className="ma-timeline-item">
                <span className="ma-timeline-dot" style={{ background: statusColor[h.status] }} />
                <div>
                  <p className="ma-timeline-status">{h.status}</p>
                  <p className="ma-timeline-time">{new Date(h.at).toLocaleString()}</p>
                  {h.note && <p className="ma-timeline-note">{h.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Modal>
      )}

      {notesFor && (
        <Modal onClose={() => setNotesFor(null)}>
          <h3 className="ma-modal-title">Notes for {notesFor.name}</h3>
          <textarea
            rows={6}
            className="ma-notes-input"
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Internal notes visible only to you..."
            maxLength={2000}
          />
          <p className="ma-notes-count">{notesDraft.length} / 2000</p>
          <div className="ma-modal-actions" style={{ justifyContent: "flex-end", gap: 8 }}>
            <Button variant="ghost" onClick={() => setNotesFor(null)}>Cancel</Button>
            <Button onClick={onSaveNotes}>Save Notes</Button>
          </div>
        </Modal>
      )}

      <Confirm
        open={!!confirmDelete}
        title="Withdraw application?"
        message="Your application and resume will be permanently removed."
        confirmText="Withdraw"
        onConfirm={doRemove}
        onClose={() => setConfirmDelete(null)}
      />
    </section>
  );
};

export default MyApplications;
