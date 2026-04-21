import React from "react";
import "./Modal.css";

const Modal = ({ children, onClose }) => (
  <div className="ui-modal-overlay" onClick={onClose}>
    <div className="ui-modal-body" onClick={(e) => e.stopPropagation()}>
      <span className="ui-modal-close" onClick={onClose}>&times;</span>
      {children}
    </div>
  </div>
);

export default Modal;
