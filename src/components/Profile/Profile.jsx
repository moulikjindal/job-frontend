import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneFlip } from "react-icons/fa6";
import { RiLock2Fill } from "react-icons/ri";
import {
  FiGlobe, FiLinkedin, FiGithub, FiTwitter, FiMapPin, FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { Input, Button, SectionTitle, Avatar, Switch, Badge } from "../../ui";
import PasswordStrength from "../Common/PasswordStrength";
import "./Profile.css";

const AVATAR_COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#0ea5e9"];

const computeCompleteness = (u, role) => {
  if (!u) return 0;
  const jobSeekerFields = ["name", "phone", "headline", "bio", "skills", "location", "portfolioUrl", "linkedinUrl"];
  const employerFields = ["name", "phone", "companyName", "bio", "companyWebsite", "location", "companySize"];
  const fields = role === "Employer" ? employerFields : jobSeekerFields;
  let filled = 0;
  for (const f of fields) {
    const v = u[f];
    if (Array.isArray(v) ? v.length > 0 : (v && String(v).trim().length > 0)) filled++;
  }
  return Math.round((filled / fields.length) * 100);
};

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const isEmployer = user?.role === "Employer";
  const [tab, setTab] = useState("profile"); // profile | security

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [availableForWork, setAvailableForWork] = useState(true);
  const [avatarColor, setAvatarColor] = useState("#4f46e5");

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user?._id) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setHeadline(user.headline || "");
      setBio(user.bio || "");
      setSkills((user.skills || []).join(", "));
      setLocation(user.location || "");
      setPortfolioUrl(user.portfolioUrl || "");
      setLinkedinUrl(user.linkedinUrl || "");
      setGithubUrl(user.githubUrl || "");
      setTwitterUrl(user.twitterUrl || "");
      setAvailableForWork(user.availableForWork !== false);
      setAvatarColor(user.avatarColor || "#4f46e5");
      setCompanyName(user.companyName || "");
      setCompanyWebsite(user.companyWebsite || "");
      setCompanySize(user.companySize || "");
    }
  }, [user]);

  const completeness = useMemo(() => computeCompleteness(user, user?.role), [user]);

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name, phone, headline, bio, location,
        portfolioUrl, linkedinUrl, githubUrl, twitterUrl,
        availableForWork, avatarColor,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        companyName, companyWebsite, companySize,
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");
    setSavingPassword(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setOldPassword(""); setNewPassword("");
      toast.success("Password updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <section className="profile-page">
      <div className="profile-inner">
        <SectionTitle sub="Manage your account and profile settings">My Profile</SectionTitle>

        <div className="profile-grid">
          <div className="profile-card">
            <Avatar name={name || user?.name} color={avatarColor} size={96} />
            <h3>{name || "Your Name"}</h3>
            <p className="profile-role">{user?.role}</p>
            <p className="profile-email">{user?.email}</p>

            {!isEmployer && (
              <Badge variant={availableForWork ? "success" : "muted"} style={{ marginTop: 12 }}>
                {availableForWork ? "Open to work" : "Not currently looking"}
              </Badge>
            )}

            <div className="profile-completeness">
              <div className="pc-head">
                <span>Profile completeness</span>
                <strong>{completeness}%</strong>
              </div>
              <div className="pc-track">
                <div className="pc-fill" style={{ width: `${completeness}%` }} />
              </div>
              {completeness < 100 && (
                <p className="pc-hint">Fill out more fields to improve your visibility.</p>
              )}
              {completeness === 100 && (
                <p className="pc-hint pc-hint--ok"><FiCheckCircle /> Your profile is complete!</p>
              )}
            </div>

            <div className="profile-meta">
              <span>Joined</span>
              <strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</strong>
            </div>
          </div>

          <div className="profile-forms">
            <div className="profile-tabs">
              <button className={`profile-tab ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
                Profile
              </button>
              <button className={`profile-tab ${tab === "security" ? "active" : ""}`} onClick={() => setTab("security")}>
                Security
              </button>
            </div>

            {tab === "profile" && (
              <>
                <form className="profile-form" onSubmit={onSaveProfile}>
                  <h4>Account Information</h4>
                  <div className="form-row">
                    <Input label="Full Name" icon={FaRegUser} value={name} onChange={(e) => setName(e.target.value)} />
                    <Input label="Phone" icon={FaPhoneFlip} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <Input label="Email" icon={MdOutlineMailOutline} value={user?.email || ""} disabled />
                  <Input label="Location" icon={FiMapPin} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bengaluru, India" />

                  {isEmployer ? (
                    <>
                      <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Acme Inc." />
                      <div className="form-row">
                        <Input label="Company Website" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="https://acme.com" />
                        <Input label="Company Size" value={companySize} onChange={(e) => setCompanySize(e.target.value)} placeholder="e.g. 51-200" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Input label="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Senior React Developer" />
                      <Input label="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, MongoDB" />
                      <div className="profile-switch-row">
                        <Switch
                          id="avail"
                          checked={availableForWork}
                          onChange={setAvailableForWork}
                          label="Open to work opportunities"
                        />
                      </div>
                    </>
                  )}

                  <div className="ui-input-group">
                    <label className="ui-input-label">About / Bio</label>
                    <textarea
                      className="profile-textarea"
                      rows={5}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={isEmployer ? "Tell candidates about your company..." : "Tell employers about yourself..."}
                      maxLength={1000}
                    />
                    <p className="profile-char-count">{bio.length} / 1000</p>
                  </div>

                  <div className="ui-input-group">
                    <label className="ui-input-label">Avatar Color</label>
                    <div className="profile-colors">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          type="button"
                          key={c}
                          className={`profile-color ${avatarColor === c ? "active" : ""}`}
                          style={{ background: c }}
                          onClick={() => setAvatarColor(c)}
                          aria-label={`Use color ${c}`}
                        />
                      ))}
                    </div>
                  </div>

                  <Button type="submit" disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </form>

                <form className="profile-form" onSubmit={(e) => { e.preventDefault(); onSaveProfile(e); }}>
                  <h4>Links & Social</h4>
                  <Input label="Portfolio / Website" icon={FiGlobe} value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://your.site" />
                  <div className="form-row">
                    <Input label="LinkedIn" icon={FiLinkedin} value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/you" />
                    <Input label="GitHub" icon={FiGithub} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/you" />
                  </div>
                  <Input label="Twitter / X" icon={FiTwitter} value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://x.com/you" />
                  <Button type="submit" variant="accent" disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save Links"}
                  </Button>
                </form>
              </>
            )}

            {tab === "security" && (
              <form className="profile-form" onSubmit={onChangePassword}>
                <h4>Change Password</h4>
                <Input
                  label="Current Password"
                  icon={RiLock2Fill}
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Input
                  label="New Password"
                  icon={RiLock2Fill}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <PasswordStrength value={newPassword} />
                <Button type="submit" variant="accent" disabled={savingPassword}>
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
