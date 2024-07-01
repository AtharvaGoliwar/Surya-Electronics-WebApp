import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");
  const [style, setStyle] = useState({ display: "none" });
  const navigate = useNavigate();
  const login = async (e) => {
    e?.preventDefault();
    // const dets = [parseInt(user), passwd];
    try {
      const res = await axios.post(
        "http://localhost:8800/login",
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
    }
  };
  return (
    <>
      <div>
        <input
          type="text"
          placeholder="User ID"
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPasswd(e.target.value)}
        />
        <button onClick={() => login()}>Login</button>
        <div style={style}>Successful Login</div>
      </div>
    </>
  );
}
