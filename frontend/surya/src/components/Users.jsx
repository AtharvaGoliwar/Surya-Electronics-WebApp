import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8800/users");
        console.log(res?.data);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);
  return (
    <>
      <div>
        Users
        {console.log(users)}
        <div>
          {users.map((rec) =>
            rec.userId !== "admin" ? (
              <div>
                {rec.userId}, {rec.password}
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </>
  );
}
