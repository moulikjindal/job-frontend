import React from "react";
import "./Input.css";
import "./Select.css";

const Select = ({ icon: Icon, label, options = [], placeholder, className = "", ...props }) => (
  <div className={`ui-input-group ${className}`}>
    {label && <label className="ui-input-label">{label}</label>}
    <div className="ui-input-wrapper">
      <select className="ui-input" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={typeof opt === "string" ? opt : opt.value} value={typeof opt === "string" ? opt : opt.value}>
            {typeof opt === "string" ? opt : opt.label}
          </option>
        ))}
      </select>
      {Icon && <span className="ui-input-icon"><Icon /></span>}
    </div>
  </div>
);

export default Select;
