import React from "react";
import "./Highlight.css";

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const Highlight = ({ text = "", query = "" }) => {
  const q = String(query || "").trim();
  if (!q) return <>{text}</>;
  const re = new RegExp(`(${escapeRegex(q)})`, "gi");
  const parts = String(text).split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? <mark key={i} className="ui-highlight">{p}</mark> : <React.Fragment key={i}>{p}</React.Fragment>
      )}
    </>
  );
};

export default Highlight;
