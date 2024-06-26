import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExtraData() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/deletedemp");
        const retrievedData = res.data;
        setData(retrievedData);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

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

  const handleCheckBoxChange = (empId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(empId)
        ? prevSelectedUsers.filter((n) => n !== empId)
        : [...prevSelectedUsers, empId]
    );
  };

  const handleSubmit = async () => {
    console.log("Submitted Users: ", selectedUsers, selectedUsers.length);
    try {
      const res = await axios.post("http://localhost:8800/sendextradata", {
        users: selectedUsers,
        data: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div>
        Hello From Deleted Employees Data
        {data.map((rec, index) => (
          <div key={index}>
            {rec["Invoice Date"]},{rec.bpcode},{rec.ItemName},{rec.salesEmp},
            {rec.ItemTotal},{rec.review}
          </div>
        ))}
        {users.map((emp, index) => (
          <div key={index}>
            <input
              type="checkbox"
              value={emp.userId}
              checked={selectedUsers.includes(emp.userId)}
              onChange={() => handleCheckBoxChange(emp.userId)}
            />
            {emp.userId}
          </div>
        ))}
        <button onClick={() => handleSubmit()}>Send Data</button>
      </div>
    </>
  );
}
