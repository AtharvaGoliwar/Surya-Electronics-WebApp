import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Employee1() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const navigate = useNavigate();

  // Fetch session data on mount
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/session");
        const userID = res?.data.userId;
        setUser(userID);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSessionData();
  }, []);

  // Fetch employee data when user is set
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (user) {
        try {
          const url = `http://localhost:8800/emp`;
          const params = { empid: user };
          const res1 = await axios.get(url, { params });
          const newData = res1.data;

          // Process the data immediately
          let cust = newData.map((item) => item.bpName);
          let updatedCust = [];
          cust.forEach((name, index) => {
            updatedCust[index] = updatedCust.includes(name) ? "" : name;
          });

          const updatedDisplayData = newData.map((rec, index) => ({
            ...rec,
            bpName: updatedCust[index],
          }));

          setData(newData);
          setDisplayData(updatedDisplayData);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchEmployeeData();
  }, [user]);

  const Logout = async () => {
    try {
      await axios.post("http://localhost:8800/logout", {});
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      Hello Employee
      <button onClick={Logout}>Logout</button>
      <div>
        {displayData.map((rec) => (
          <div key={rec.id}>
            {rec.salesEmp}, {rec.Branch}, {rec.bpName}, {rec.ItemName},{" "}
            {rec.ItemTotal}
          </div>
        ))}
      </div>
    </div>
  );
}
