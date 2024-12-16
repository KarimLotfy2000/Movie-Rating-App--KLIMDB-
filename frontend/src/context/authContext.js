import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [currentUser, setcurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setcurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
