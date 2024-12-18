import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import styles from "./Header.module.css";

function Header() {
  const { currentUser, setcurrentUser } = useContext(AuthContext);

  const logout = () => {
    localStorage.clear();
    setcurrentUser(null);
    window.location = "/login";
  };

  const firstName = currentUser && currentUser.name.split(" ")[0];

  return (
    <div className={styles.header}>
      <Link to="/">
        <h1 className={styles.headerTitle}>KLIMDB</h1>
      </Link>

      {currentUser && <h3 className={styles.username}>Welcome {firstName}</h3>}

      <div className={styles.buttons}>
        <Link to="/">
          <button className={styles.navButton}>Home</button>
        </Link>
        {currentUser && (
          <Link to="/favourites">
            <button className={styles.navButton}>Favourites</button>
          </Link>
        )}
        {currentUser ? (
          <div>
            <button onClick={logout} className={styles.navButton}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className={styles.navButton}>Login</button>
          </Link>
        )}
        {!currentUser && (
          <Link to="/register">
            <button className={styles.navButton}>Register</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
