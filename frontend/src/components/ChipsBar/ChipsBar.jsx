import React from "react";
import styles from "./ChipsBar.module.css";

const ChipsBar = ({ filters, clearFilter }) => {
  return (
    <div className={styles.chipsBar}>
      {Object.entries(filters).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;

        if (Array.isArray(value)) {
          return value.map((item, index) => (
            <div key={`${key}-${index}`} className={styles.chip}>
              {item}
              <button
                className={styles.clearButton}
                onClick={() => clearFilter(key, item)}
              >
                ✕
              </button>
            </div>
          ));
        }

        return (
          <div key={key} className={styles.chip}>
            {value}
            <button
              className={styles.clearButton}
              onClick={() => clearFilter(key)}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ChipsBar;
