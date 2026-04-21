import React from "react";
import "./Switch.css";

const Switch = ({ checked, onChange, label, id, size = "md" }) => (
  <label className={`ui-switch ui-switch--${size}`} htmlFor={id}>
    <input id={id} type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />
    <span className="ui-switch-track"><span className="ui-switch-thumb" /></span>
    {label && <span className="ui-switch-label">{label}</span>}
  </label>
);

export default Switch;
