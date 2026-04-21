import React from "react";
import { FaUserPlus, FaSearch, FaPaperPlane, FaBriefcase, FaClipboardList, FaHandshake } from "react-icons/fa";
import { SectionTitle } from "../../ui";
import "./HowItWorks.css";

const seekerSteps = [
  { num: "01", icon: FaUserPlus, title: "Create Profile", desc: "Sign up and build your professional profile in minutes." },
  { num: "02", icon: FaSearch, title: "Search Jobs", desc: "Browse thousands of openings filtered by role, location & salary." },
  { num: "03", icon: FaPaperPlane, title: "Apply & Get Hired", desc: "Submit applications with one click and track your progress." },
];

const employerSteps = [
  { num: "01", icon: FaBriefcase, title: "Post a Job", desc: "Create detailed job listings to attract the right talent." },
  { num: "02", icon: FaClipboardList, title: "Review Applications", desc: "Browse resumes and shortlist candidates effortlessly." },
  { num: "03", icon: FaHandshake, title: "Hire the Best", desc: "Connect with top candidates and close positions faster." },
];

const HowItWorks = () => (
  <section className="hiw">
    <div className="hiw-inner">
      <SectionTitle sub="Simple steps to get started">How It Works</SectionTitle>

      <div className="hiw-paths">
        <div className="hiw-path">
          <h3 className="hiw-path-title">For Job Seekers</h3>
          <div className="hiw-steps">
            {seekerSteps.map(({ num, icon: Icon, title, desc }, i) => (
              <div className="hiw-step reveal" key={num} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="hiw-step-num">{num}</div>
                <div className="hiw-step-icon"><Icon /></div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-divider" />

        <div className="hiw-path">
          <h3 className="hiw-path-title hiw-path-title--accent">For Employers</h3>
          <div className="hiw-steps">
            {employerSteps.map(({ num, icon: Icon, title, desc }, i) => (
              <div className="hiw-step hiw-step--accent reveal" key={num} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="hiw-step-num">{num}</div>
                <div className="hiw-step-icon"><Icon /></div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
