import React from "react";
import "./Badge.css";

const Badge = ({ children, variant = "primary", className = "", style }) => (
  <span className={`ui-badge ui-badge--${variant} ${className}`} style={style}>
    {children}
  </span>
);

export default Badge;
