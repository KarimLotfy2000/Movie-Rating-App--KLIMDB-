import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.modalBody}>{children}</div>
        <div className={styles.modalActions}>{actions}</div>
      </div>
    </div>
  );
};

export default Modal;
