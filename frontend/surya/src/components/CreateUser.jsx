import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  const createUser = async (e) => {
    e?.preventDefault();
    const userDetails = {
      userId: user,
      password: passwd,
      role: role,
      name: name,
      number: number,
    };
    try {
      await axios.post("http://localhost:8800/addUser", userDetails, {
        withCredentials: true,
      });
      const res = await axios.post(
        "http://localhost:8800/createTable",
        {
          user: user,
          role: role,
        },
        { withCredentials: true }
      );
      console.log(res.data.message);
      // navigate("/");
    } catch (err) {
      console.log(err);
      console.error("Error creating table:", err);
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
      <input
        type="radio"
        name="role"
        id=""
        onChange={(e) => setRole(e.target.value)}
        value={"employee"}
      />
      Employee
      <input
        type="radio"
        name="role"
        id=""
        onChange={(e) => setRole(e.target.value)}
        value={"admin"}
      />{" "}
      Admin
      <br />
      Name:
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      Phone Number:
      <input
        type="number"
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Phone Number"
      />
      <button onClick={() => createUser()}>Create User</button>
    </>
  );
}
