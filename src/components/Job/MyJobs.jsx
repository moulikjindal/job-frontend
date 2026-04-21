import React, { useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import {
  FaRegEdit, FaTrash, FaUsers, FaRegCopy, FaStar, FaRegStar,
  FaSearch, FaEye,
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMyJobs } from "../../hooks/useJobs";
import { JOB_CATEGORIES } from "../../constants";
import { Button, SectionTitle, Confirm, Switch, EmptyState, Badge, Tooltip } from "../../ui";
import "./MyJobs.css";

const MyJobs = () => {
  const [editingMode, setEditingMode] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | expired | featured
  const { myJobs, loading, updateJobLocal, saveJob, removeJob, toggleField, cloneJob } = useMyJobs();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return myJobs.filter((j) => {
      if (filter === "active" && j.expired) return false;
      if (filter === "expired" && !j.expired) return false;
      if (filter === "featured" && !j.featured) return false;
      if (needle && !`${j.title} ${j.city} ${j.country} ${j.category}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [myJobs, q, filter]);

  const counts = {
    all: myJobs.length,
    active: myJobs.filter((j) => !j.expired).length,
    expired: myJobs.filter((j) => j.expired).length,
    featured: myJobs.filter((j) => j.featured).length,
  };

  const handleSave = async (id) => {
    try {
      await saveJob(id);
      toast.success("Job updated!");
      setEditingMode(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await removeJob(id);
      toast.success("Job deleted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const onToggle = async (id, field, label) => {
    try {
      await toggleField(id, field);
      toast.success(`${label} updated.`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to update ${label.toLowerCase()}`);
    }
  };

  const onDuplicate = async (id) => {
    try {
      await cloneJob(id);
      toast.success("Job duplicated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to duplicate");
    }
  };

  return (
    <div className="my-jobs">
      <div className="mj-inner">
        <div className="mj-head-row">
          <SectionTitle>Your Posted Jobs</SectionTitle>
          <Link to="/job/post" className="mj-new-btn">+ Post New Job</Link>
        </div>

        {myJobs.length > 0 && (
          <div className="mj-toolbar">
            <div className="mj-search">
              <FaSearch />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search your jobs by title, city, category..."
              />
            </div>
            <div className="mj-tabs">
              {[
                ["all", "All"],
                ["active", "Active"],
                ["expired", "Expired"],
                ["featured", "Featured"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  className={`mj-tab ${filter === val ? "active" : ""}`}
                  onClick={() => setFilter(val)}
                >
                  {label} <span className="mj-tab-count">{counts[val]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="mj-loading">
            <div className="spinner" />
            <p>Loading your jobs...</p>
          </div>
        ) : myJobs.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No jobs posted yet"
            message="Start by posting your first listing to find great candidates."
            action={<Link to="/job/post" className="mj-new-btn">Post Your First Job</Link>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="No matching jobs"
            message="Try a different filter or clear the search term."
            action={<button className="jobs-filter-btn" onClick={() => { setQ(""); setFilter("all"); }}>Reset</button>}
          />
        ) : (
          <div className="mj-list">
            {filtered.map((el) => {
              const editing = editingMode === el._id;
              return (
                <div className={`mj-card ${el.featured ? "mj-card--featured" : ""}`} key={el._id}>
                  <div className="mj-top">
                    <div>
                      <Link to={`/job/${el._id}`} className="mj-title-link">{el.title}</Link>
                      <div className="mj-pills">
                        <Badge variant={el.expired ? "danger" : "success"}>
                          {el.expired ? "Expired" : "Active"}
                        </Badge>
                        {el.featured && <Badge variant="featured"><FaStar /> Featured</Badge>}
                        {el.isRemote && <Badge variant="info">Remote</Badge>}
                        <Badge variant="primary">{el.category}</Badge>
                        <Badge variant="muted">
                          <FaUsers /> {el.applicationsCount || 0}
                        </Badge>
                        <Badge variant="muted">
                          <FaEye /> {el.viewCount || 0}
                        </Badge>
                      </div>
                    </div>
                    <div className="mj-top-actions">
                      {editing ? (
                        <>
                          <Button variant="accent" onClick={() => handleSave(el._id)} title="Save changes">
                            <FaCheck /> Save
                          </Button>
                          <Button variant="ghost" onClick={() => setEditingMode(null)} title="Cancel">
                            <RxCross2 /> Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Tooltip content={el.featured ? "Unfeature" : "Mark featured"}>
                            <button
                              className="mj-icon-btn"
                              onClick={() => onToggle(el._id, "featured", "Featured")}
                              aria-label="Toggle featured"
                            >
                              {el.featured ? <FaStar style={{ color: "#f59e0b" }} /> : <FaRegStar />}
                            </button>
                          </Tooltip>
                          <Tooltip content="Duplicate">
                            <button className="mj-icon-btn" onClick={() => onDuplicate(el._id)} aria-label="Duplicate">
                              <FaRegCopy />
                            </button>
                          </Tooltip>
                          <Button variant="secondary" onClick={() => setEditingMode(el._id)}>
                            <FaRegEdit /> Edit
                          </Button>
                          <Button variant="danger" onClick={() => setConfirmDelete(el._id)}>
                            <FaTrash /> Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mj-toggles">
                    <Switch
                      size="sm"
                      checked={!el.expired}
                      onChange={() => onToggle(el._id, "expired", "Status")}
                      label={el.expired ? "Expired" : "Accepting applications"}
                      id={`expired-${el._id}`}
                    />
                    <Switch
                      size="sm"
                      checked={!!el.isRemote}
                      onChange={() => onToggle(el._id, "isRemote", "Remote")}
                      label="Remote"
                      id={`remote-${el._id}`}
                    />
                  </div>

                  <div className="mj-fields">
                    <div className="mj-short">
                      <FieldBlock label="Title">
                        <input type="text" disabled={!editing} value={el.title}
                          onChange={(e) => updateJobLocal(el._id, "title", e.target.value)} />
                      </FieldBlock>
                      <FieldBlock label="Country">
                        <input type="text" disabled={!editing} value={el.country}
                          onChange={(e) => updateJobLocal(el._id, "country", e.target.value)} />
                      </FieldBlock>
                      <FieldBlock label="City">
                        <input type="text" disabled={!editing} value={el.city}
                          onChange={(e) => updateJobLocal(el._id, "city", e.target.value)} />
                      </FieldBlock>
                      <FieldBlock label="Category">
                        <select disabled={!editing} value={el.category}
                          onChange={(e) => updateJobLocal(el._id, "category", e.target.value)}>
                          <option value="">Select Category</option>
                          {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </FieldBlock>
                      <FieldBlock label="Tags (comma separated)">
                        <input
                          type="text"
                          disabled={!editing}
                          value={(el.tags || []).join(", ")}
                          onChange={(e) => updateJobLocal(el._id, "tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                          placeholder="remote, urgent, fully-paid"
                        />
                      </FieldBlock>
                      <FieldBlock label="Salary">
                        {el.fixedSalary ? (
                          <input type="number" disabled={!editing} value={el.fixedSalary}
                            onChange={(e) => updateJobLocal(el._id, "fixedSalary", e.target.value)} />
                        ) : (
                          <div className="mj-range">
                            <input type="number" disabled={!editing} value={el.salaryFrom || ""}
                              placeholder="From"
                              onChange={(e) => updateJobLocal(el._id, "salaryFrom", e.target.value)} />
                            <input type="number" disabled={!editing} value={el.salaryTo || ""}
                              placeholder="To"
                              onChange={(e) => updateJobLocal(el._id, "salaryTo", e.target.value)} />
                          </div>
                        )}
                      </FieldBlock>
                    </div>
                    <div className="mj-long">
                      <FieldBlock label="Description">
                        <textarea rows={5} disabled={!editing} value={el.description}
                          onChange={(e) => updateJobLocal(el._id, "description", e.target.value)} />
                      </FieldBlock>
                      <FieldBlock label="Location">
                        <textarea rows={3} disabled={!editing} value={el.location}
                          onChange={(e) => updateJobLocal(el._id, "location", e.target.value)} />
                      </FieldBlock>
                    </div>
                  </div>

                  <div className="mj-footer">
                    <span className="mj-posted">
                      <FiMapPin /> Posted {new Date(el.jobPostedOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Confirm
        open={!!confirmDelete}
        title="Delete this job?"
        message="This will permanently remove the job listing. Applicants will no longer be able to see or apply to it."
        confirmText="Delete"
        onConfirm={doDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
};

const FieldBlock = ({ label, children }) => (
  <div>
    <span className="mj-field-label">{label}</span>
    {children}
  </div>
);

export default MyJobs;
