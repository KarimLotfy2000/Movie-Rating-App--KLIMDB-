import React, { createContext, useState, useContext } from "react";
import Snackbar from "../components/Snackbar/Snackbar";

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info", // Default type
  });

  const showSnackbar = (message, type = "info") => {
    setSnackbar({ open: true, message, type });

    setTimeout(() => {
      setSnackbar({ open: false, message: "", type: "info" });
    }, 3000); // Automatically hide after 3 seconds
  };

  return (
    <ErrorContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: "", type: "info" })}
      />
    </ErrorContext.Provider>
  );
};
