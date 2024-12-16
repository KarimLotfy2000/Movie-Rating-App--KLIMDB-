import React from "react";
import styles from "./Snackbar.module.css";

function Snackbar({ message, type = "info", open, onClose }) {
  if (!open) return null;

  return (
    <div
      className={`${styles.snackbar} ${
        type === "success"
          ? styles.success
          : type === "error"
          ? styles.error
          : styles.info
      }`}
      onClick={onClose}
    >
      <p>{message}</p>
    </div>
  );
}

export default Snackbar;
