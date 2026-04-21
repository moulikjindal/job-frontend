import React from "react";
import "./SectionTitle.css";

const SectionTitle = ({ children, sub }) => (
  <div className="ui-section-title">
    <h2>{children}</h2>
    {sub && <p className="ui-section-sub">{sub}</p>}
    <div className="ui-section-line" />
  </div>
);

export default SectionTitle;
