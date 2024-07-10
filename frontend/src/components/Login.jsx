import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import config from "../config";
import "./login.css";

export default function Login() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");
  const [style, setStyle] = useState({ display: "none" });
  const navigate = useNavigate();
  const login = async (e) => {
    e?.preventDefault();
    // const dets = [parseInt(user), passwd];
    // const url = config.backendUrl;
    const url = import.meta.env.VITE_BACKEND_URL;
    console.log(url);
    try {
      const res = await axios.post(
        // "http://localhost:8800/login",
        // `${process.env.REACT_APP_BACKEND_URL}/login`,
        // "https://surya-electronics-webapp.onrender.com/login",
        `${url}/login`,
        {
          user,
          passwd,
        },
        { withCredentials: true }
      );
      console.log(res?.data.username);
      console.log(res?.data.passwd);
      if (res?.data.role === "admin") {
        navigate("/admin");
      } else {
        if (res.data.message === "Login Successful") {
          console.log(res?.data);
          setStyle({ display: "block" });
          localStorage.setItem("user", res?.data.username);
          navigate("/emp");
        } else {
          console.log(res?.data);
          setStyle({ display: "block", color: "red" });
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        alert("Enter valid credentials");
      }
    }
  };
  return (
    <>
      <div className="login-container">
        <div className="login-form">
          <h2>Login To Your Account</h2>
          <div className="input-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              placeholder="User ID"
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPasswd(e.target.value)}
            />
          </div>

          <button onClick={() => login()} className="login">
            Login
          </button>
          <div style={style}>Successful Login</div>
        </div>
      </div>
    </>
  );
}
