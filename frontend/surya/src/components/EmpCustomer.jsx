import React, { useState } from "react";

import axios from "axios";

export default function EmpCustomer() {
  const [records, setRecords] = useState({});
  useState(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get("http://localhost:8800/users", {
          withCredentials: true,
        });
        const newRecords = {};

        for (let i = 0; i < res?.data.length; i++) {
          if (res.data[i]["role"] !== "admin") {
            const employee = res.data[i]["userId"];
            const params = { empid: res.data[i]["userId"] };
            const res1 = await axios.get("http://localhost:8800/emp", {
              params,
              withCredentials: true,
            });
            newRecords[employee] = res1.data;
          }
        }

        setRecords(newRecords);
        console.log(newRecords);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecords();
  }, []);

  const Reviews = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8800/finalreview",
        records,
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        Hello World
        {console.log(records)}
        {Object.keys(records).map((empId) => (
          <div key={empId}>
            <h3>Employee Id: {empId}</h3>
            {records[empId].map((record) => (
              <div key={record.bpCode}>
                <p>Invoice Date: {record["Invoice Date"]}</p>
                <p>BP Name: {record.bpName}</p>
                <p>BP Code: {record.bpcode}</p>
                <p>Item Name: {record.ItemName}</p>
                <p>Item Cost: {record.ItemTotal}</p>
                <p>Sales Man: {record.salesEmp}</p>
                <p>Review: {record.review}</p>
                <p>Description: {record.description}</p>
              </div>
            ))}
          </div>
        ))}
        <button onClick={() => Reviews()}>Update Reviews</button>
      </div>
    </>
  );
}
