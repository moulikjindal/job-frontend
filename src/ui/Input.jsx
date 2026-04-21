import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Input.css";

const Input = ({ icon: Icon, label, type, className = "", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`ui-input-group ${className}`}>
      {label && <label className="ui-input-label">{label}</label>}
      <div className="ui-input-wrapper">
        <input
          className="ui-input"
          type={isPassword && showPassword ? "text" : type}
          {...props}
        />
        {isPassword && (
          <span
            className="ui-input-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        )}
        {Icon && <span className="ui-input-icon"><Icon /></span>}
      </div>
    </div>
  );
};

export default Input;
