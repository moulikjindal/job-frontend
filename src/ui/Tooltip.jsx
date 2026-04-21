import React from "react";
import "./Tooltip.css";

const Tooltip = ({ children, content, placement = "top" }) => (
  <span className="ui-tooltip-wrap">
    {children}
    {content && (
      <span className={`ui-tooltip ui-tooltip--${placement}`} role="tooltip">
        {content}
      </span>
    )}
  </span>
);

export default Tooltip;
