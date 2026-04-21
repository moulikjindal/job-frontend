import React from "react";
import "./Avatar.css";

const initials = (name = "?") =>
  name.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

const Avatar = ({ name, color = "#4f46e5", size = 40, className = "" }) => (
  <span
    className={`ui-avatar ${className}`}
    style={{
      width: size,
      height: size,
      fontSize: Math.max(12, size * 0.38),
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    }}
    title={name}
  >
    {initials(name)}
  </span>
);

export default Avatar;
