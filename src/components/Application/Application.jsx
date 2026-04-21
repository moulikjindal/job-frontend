import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { FiUpload, FiFileText } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useJobDetail } from "../../hooks/useJobs";
import * as api from "../../api";
import { Input, Button } from "../../ui";
import "./Application.css";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = "application/pdf,image/png,image/jpeg,image/webp";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthorized, user } = useAuth();
  const navigateTo = useNavigate();
  const { id } = useParams();
  const { job, loading: jobLoading } = useJobDetail(id);

  useEffect(() => {
    if (user?._id) {
      setName((prev) => prev || user.name || "");
      setEmail((prev) => prev || user.email || "");
      setPhone((prev) => prev || user.phone || "");
    }
  }, [user]);

  if (!isAuthorized || (user && user.role === "Employer")) {
    return <Navigate to="/" replace />;
  }

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
      toast.error("Resume must be under 5MB.");
      e.target.value = "";
      return;
    }
    setResume(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Please attach your resume (PDF or image).");
    if (coverLetter.length < 30) return toast.error("Cover letter must be at least 30 characters.");

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);
    try {
      const { data } = await api.postApplication(formData);
      toast.success(data.message);
      navigateTo("/applications/me");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="application-page">
      <div className="app-inner">
        {!jobLoading && job && (
          <div className="app-job-summary">
            <p className="app-job-label">Applying for</p>
            <h2>{job.title}</h2>
            <p className="app-job-meta">
              {(job.postedBy?.companyName || job.postedBy?.name || "Company")} · {job.city}, {job.country}
            </p>
          </div>
        )}

        <div className="app-card">
          <h3>Application Form</h3>
          <form className="app-form" onSubmit={handleSubmit}>
            <div className="app-grid">
              <Input label="Full Name" type="text" placeholder="Your Name"
                value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email Address" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Phone Number" type="tel" placeholder="Your Phone"
                value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input label="Address" type="text" placeholder="Your Address"
                value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <div className="ui-input-group">
              <label className="ui-input-label">Cover Letter</label>
              <textarea
                placeholder="Explain why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                maxLength={2000}
                required
              />
              <p className="app-char-count">{coverLetter.length} / 2000</p>
            </div>

            <div className="app-file-upload">
              <label className="ui-input-label">Resume (PDF, PNG, JPEG or WEBP — max 5MB)</label>
              <label className="app-file-drop">
                <FiUpload className="app-file-icon" />
                <span>{resume ? resume.name : "Click to upload your resume"}</span>
                <input type="file" accept={ACCEPTED} onChange={onFileChange} />
              </label>
              {resume && (
                <p className="app-file-info">
                  <FiFileText /> {resume.name} · {(resume.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>

            <div className="app-actions">
              <Link to={`/job/${id}`} className="app-back">Cancel</Link>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Send Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Application;
