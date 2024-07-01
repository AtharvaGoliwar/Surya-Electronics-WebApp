import React, { useState } from "react";
import axios from "axios";

export default function DeleteUser() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");

  const handleDelete = async () => {
    try {
      const params = { user: user, passwd: passwd };
      let res1 = await axios.get("http://localhost:8800/usercheck", {
        params,
        withCredentials: true,
      });
      console.log(res1.data[0]["userId"], res1.data[0]["password"]);
      if (
        res1.data[0]["userId"] === user &&
        res1.data[0]["password"] === passwd
      ) {
        await axios.delete("http://localhost:8800/deleteUser", {
          data: { user, passwd },
          withCredentials: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div>
        Delete User
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
        <button onClick={() => handleDelete()}>Delete User</button>
      </div>
    </>
  );
}
