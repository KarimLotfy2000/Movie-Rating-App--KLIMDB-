import React, { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { BASE_URL } from "../consts";

function Header() {
  const { currentUser, setcurrentUser } = useContext(AuthContext);

  function logout() {
    axios
      .delete(`${BASE_URL}/users/logout`, { withCredentials: true })
      .then((res) => {
        setcurrentUser(null);
        window.location = "/login";
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="header">
      <Link to="/">
        <h1 className="header-title">KLIMDB</h1>
      </Link>

      {currentUser && (
        <h3 className="username">Welcome "{currentUser.name}"</h3>
      )}

      <div className="buttons">
        <Link to="/">
          <button className="login-button">Home</button>
        </Link>
        {currentUser && (
          <Link to="/favourites">
            <button className="login-button">Favourites</button>
          </Link>
        )}
        {currentUser ? (
          <div>
            <button onClick={logout} className="login-button">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        )}

        <Link to="/register">
          <button className="register-button">Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
