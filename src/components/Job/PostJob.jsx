import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { JOB_CATEGORIES } from "../../constants";
import * as api from "../../api";
import { Input, Select, Button, SectionTitle } from "../../ui";
import "./PostJob.css";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead"];

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experienceLevel, setExperienceLevel] = useState("Entry");
  const [skills, setSkills] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salaryType) return toast.error("Please select a salary type.");
    if (description.length < 30) return toast.error("Description must be at least 30 characters.");

    const base = {
      title, description, category, country, city, location,
      employmentType, experienceLevel,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const payload = salaryType === "Fixed Salary"
      ? { ...base, fixedSalary: Number(fixedSalary) }
      : { ...base, salaryFrom: Number(salaryFrom), salaryTo: Number(salaryTo) };

    setSubmitting(true);
    try {
      const { data } = await api.postJob(payload);
      toast.success(data.message);
      navigateTo("/job/me");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-job">
      <div className="post-inner">
        <SectionTitle sub="Create a new listing to attract great candidates">Post a New Job</SectionTitle>
        <form className="post-form" onSubmit={handleSubmit}>
          <div className="post-row">
            <Input label="Job Title" type="text" placeholder="e.g. Senior React Developer"
              value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder="Select Category" options={JOB_CATEGORIES} />
          </div>
          <div className="post-row">
            <Select label="Employment Type" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}
              options={EMPLOYMENT_TYPES} />
            <Select label="Experience Level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}
              options={EXPERIENCE_LEVELS} />
          </div>
          <div className="post-row">
            <Input label="Country" type="text" placeholder="e.g. India"
              value={country} onChange={(e) => setCountry(e.target.value)} required />
            <Input label="City" type="text" placeholder="e.g. Bengaluru"
              value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <Input label="Full Location" type="text" placeholder="Office address or 'Remote'"
            value={location} onChange={(e) => setLocation(e.target.value)} required />

          <Input label="Required Skills (comma separated)" type="text"
            placeholder="React, Node.js, TypeScript"
            value={skills} onChange={(e) => setSkills(e.target.value)} />

          <Select
            label="Salary Type"
            value={salaryType}
            onChange={(e) => setSalaryType(e.target.value)}
            placeholder="Select Salary Type"
            options={["Fixed Salary", "Ranged Salary"]}
          />
          {salaryType === "Fixed Salary" && (
            <Input label="Fixed Salary (₹)" type="number" placeholder="e.g. 600000"
              value={fixedSalary} onChange={(e) => setFixedSalary(e.target.value)} min="1000" required />
          )}
          {salaryType === "Ranged Salary" && (
            <div className="post-row">
              <Input label="Salary From (₹)" type="number" placeholder="e.g. 500000"
                value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} min="1000" required />
              <Input label="Salary To (₹)" type="number" placeholder="e.g. 800000"
                value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} min="1000" required />
            </div>
          )}

          <div className="ui-input-group">
            <label className="ui-input-label">Job Description</label>
            <textarea
              rows="8"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              maxLength={2000}
              required
            />
            <p className="post-char-count">{description.length} / 2000</p>
          </div>

          <Button type="submit" block disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Job"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
