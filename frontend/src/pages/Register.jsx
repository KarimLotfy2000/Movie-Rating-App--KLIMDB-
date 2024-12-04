import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../consts";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${BASE_URL}/users/register`, { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image">
        <img src=" banner.jpeg" alt="Banner" />
      </div>
      <div className="auth-form">
        <div className="container">
          <h1 className="title">Register</h1>
          <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
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
              Already have an account?{" "}
              <Link to="/login" className="link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
