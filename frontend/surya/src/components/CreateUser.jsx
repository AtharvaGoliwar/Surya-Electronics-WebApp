import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");

  const navigate = useNavigate();

  const createUser = async (e) => {
    e?.preventDefault();
    const userDetails = { userId: user, password: passwd };
    try {
      await axios.post("http://localhost:8800/addUser", userDetails);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="userID"
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPasswd(e.target.value)}
      />
      <br />
      <button onClick={() => createUser()}>Create User</button>
    </>
  );
}
