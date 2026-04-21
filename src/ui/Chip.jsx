import React from "react";
import { FiX } from "react-icons/fi";
import "./Chip.css";

const Chip = ({ children, onRemove, active, onClick, className = "", icon: Icon }) => (
  <button
    type="button"
    className={`ui-chip ${active ? "ui-chip--active" : ""} ${onRemove ? "ui-chip--removable" : ""} ${className}`}
    onClick={onClick}
  >
    {Icon && <Icon className="ui-chip-icon" />}
    <span>{children}</span>
    {onRemove && (
      <span
        className="ui-chip-remove"
        onClick={(e) => { e.stopPropagation(); onRemove(e); }}
        aria-label="Remove"
      >
        <FiX />
      </span>
    )}
  </button>
);

export default Chip;
