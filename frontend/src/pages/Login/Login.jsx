import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import styles from "./Login.module.css";
import { login } from "../../api/apiServices";
import { useError } from "../../context/errorContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setcurrentUser } = useContext(AuthContext);
  const showSnackbar = useError();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await login(email, password);
      setcurrentUser(res);
      navigate("/");
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Login failed", "error");
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authImage}>
        <img src="banner.jpeg" alt="Banner" />
      </div>
      <div className={styles.authForm}>
        <div className={styles.container}>
          <h1 className={styles.title}>Login</h1>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
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
              Don't have an account?{" "}
              <Link to="/register" className={styles.link}>
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
