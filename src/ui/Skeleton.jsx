import React from "react";
import "./Skeleton.css";

const Skeleton = ({
  width = "100%",
  height = 16,
  radius = 8,
  className = "",
  style = {},
  lines = 1,
  gap = 8,
}) => {
  if (lines > 1) {
    return (
      <div className={`ui-skeleton-group ${className}`} style={{ gap }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="ui-skeleton"
            style={{
              width: i === lines - 1 ? "70%" : width,
              height,
              borderRadius: radius,
              ...style,
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={`ui-skeleton ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
};

export default Skeleton;
