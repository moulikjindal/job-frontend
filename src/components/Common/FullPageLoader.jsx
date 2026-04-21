import React from "react";
import "./FullPageLoader.css";

const FullPageLoader = ({ message = "Loading..." }) => (
  <div className="fp-loader">
    <div className="fp-spinner" />
    <p>{message}</p>
  </div>
);

export default FullPageLoader;
