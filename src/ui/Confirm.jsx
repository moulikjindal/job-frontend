import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import "./Confirm.css";

const Confirm = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onClose,
}) => {
  if (!open) return null;
  return (
    <Modal onClose={onClose}>
      <div className="ui-confirm">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="ui-confirm-actions">
          <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Confirm;
