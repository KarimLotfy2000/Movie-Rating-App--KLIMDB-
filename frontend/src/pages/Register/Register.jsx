import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.css";
import { register } from "../../api/apiServices";
import { useError } from "../../context/errorContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const showSnackbar = useError();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Registration failed", "error");
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authImage}></div>
      <div className={styles.authForm}>
        <div className={styles.container}>
          <h1 className={styles.title}>Register</h1>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <label>Password:</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button className={styles.submitButton} type="submit">
                Submit
              </button>
            </form>
            <p className={styles.toLogin}>
              Already have an account?{" "}
              <Link to="/login" className={styles.link}>
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
