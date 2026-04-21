import React from "react";
import "./Button.css";

const Button = ({ children, variant = "primary", block, className = "", ...props }) => (
  <button
    className={`ui-btn ui-btn--${variant} ${block ? "ui-btn--block" : ""} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
