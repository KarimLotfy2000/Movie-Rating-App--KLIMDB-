import axios from "axios";

const backend = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

backend.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user)?.token : null;
    if (token) {
      config.headers["Token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backend;
