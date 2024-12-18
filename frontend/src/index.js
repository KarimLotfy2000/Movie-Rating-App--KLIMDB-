import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { ErrorProvider } from "./context/errorContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ErrorProvider>
  </React.StrictMode>
);
