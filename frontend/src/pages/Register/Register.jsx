import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.css";
import { register } from "../../api/apiServices";
import { useError } from "../../context/errorContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      <div className={styles.authImage}>
        <img src="banner.jpeg" alt="Banner" />
      </div>
      <div className={styles.authForm}>
        <div className={styles.container}>
          <h1 className={styles.title}>Register</h1>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
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
