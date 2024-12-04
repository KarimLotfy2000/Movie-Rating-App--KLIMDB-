import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { BASE_URL } from "../consts";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setcurrentUser } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );
      setcurrentUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image">
        <img src="banner.jpeg" alt="Banner" />
      </div>
      <div className="auth-form">
        <div className="container">
          <h1 className="title">Login</h1>
          <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <button className="submit-button" type="submit">
                Submit
              </button>
              {error && (
                <div className="error-box">
                  <div className="error-message">{error}</div>
                </div>
              )}
            </form>
            <p className="to-login">
              Don't have an account?{" "}
              <Link to="/register" className="link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
