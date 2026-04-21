import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./Rating.css";

const Rating = ({ value = 0, max = 5, onChange, size = 18, readOnly = false }) => {
  const [hover, setHover] = useState(0);
  const displayed = hover || value;

  return (
    <div className={`ui-rating ${readOnly ? "ui-rating--readonly" : ""}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= displayed;
        return (
          <button
            key={i}
            type="button"
            className="ui-rating-star"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(i + 1)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(i + 1 === value ? 0 : i + 1)}
            aria-label={`${i + 1} star${i ? "s" : ""}`}
            style={{ fontSize: size }}
          >
            {filled ? <FaStar /> : <FaRegStar />}
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
