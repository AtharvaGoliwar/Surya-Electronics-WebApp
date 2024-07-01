import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExtraData() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/deletedemp", {
          withCredentials: true,
        });
        let retrievedData = [];
        for (let i = 0; i < res.data.length; i++) {
          try {
            const params = { empid: res.data[i] };
            const res1 = await axios.get("http://localhost:8800/emp", {
              params,
              withCredentials: true,
            });
            for (let j = 0; j < res1.data.length; j++) {
              console.log("check");
              retrievedData.push(res1.data[j]);
            }
          } catch (err) {
            console.log(err);
          }
        }
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
        const res = await axios.get("http://localhost:8800/users", {
          withCredentials: true,
        });
        console.log(res?.data);
        let updatedUsers = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i]["role"] !== "admin") {
            updatedUsers.push(res.data[i]);
          }
        }
        setUsers(updatedUsers);
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
    let updatedData = data;
    for (let i = 0; i < data.length; i++) {
      let dateObj = new Date(updatedData[i]["Invoice Date"]);
      updatedData[i]["Invoice Date"] = `${dateObj.getFullYear()}-${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
    }
    setData(updatedData);
    console.log(data);
    try {
      const res = await axios.post(
        "http://localhost:8800/sendextradata",
        {
          users: selectedUsers,
          data: data,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div>
        {console.log(data)}
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
