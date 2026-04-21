import React from "react";
import "./Card.css";

const Card = ({ children, variant = "default", className = "", ...props }) => (
  <div className={`ui-card ui-card--${variant} ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
