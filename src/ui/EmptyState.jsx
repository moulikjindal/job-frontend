import React from "react";
import "./EmptyState.css";

const EmptyState = ({ icon = "📭", title, message, action, children }) => (
  <div className="ui-empty">
    <div className="ui-empty-icon">{icon}</div>
    {title && <h3>{title}</h3>}
    {message && <p>{message}</p>}
    {action && <div className="ui-empty-action">{action}</div>}
    {children}
  </div>
);

export default EmptyState;
