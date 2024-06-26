import React from "react";
import { useState } from "react";
import axios from "axios";
import EmpCustomer from "./EmpCustomer";
import GetData from "./GetData";
import DatePick from "./DatePick";

export default function Admin() {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  const [selectedDates, setSelectedDates] = useState([]);
  // const [dateInput, setDateInput] = useState("");

  const style = { display: "hidden" };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setDate(date);
  };

  const addDate = () => {
    if (date && !selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date]);
      console.log("hello");
    }
    setDate(""); // Reset date input
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter((date) => date !== dateToRemove));
  };

  const handleGetData = async () => {
    try {
      const params = { date: selectedDates };
      let res = await axios.get("http://localhost:8800/alldata", {
        params,
      });
      const responseData = res.data;
      setData(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async () => {
    try {
      const res = await axios.get("http://localhost:8800/users");
      console.log(res?.data.length);
      // const formattedDate = date.toISOString().split("T")[0];
      // console.log(formattedDate);
      console.log(date);
      for (let i = 0; i < res?.data.length; i++) {
        console.log("hel");
        if (res.data[i]["userId"] != "admin") {
          let res1 = await axios.post("http://localhost:8800/send", {
            userId: res.data[i]["userId"],
            date: selectedDates,
          });
        }
      }
      //   let res1 = await axios.post("http://localhost:8800/send", {
      //     userId: "123",
      //   });
      //   let res2 = await axios.post("http://localhost:8800/send", {
      //     userId: "123",
      //   });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div>
        Hello Admin
        <button onClick={() => handleSend()}>Send</button>
        <EmpCustomer />
        {/* <GetData /> */}
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          required
          className="date-picker"
        />
        <button onClick={() => addDate()}>Add Date</button>
      </div>
      <h3>Selected Dates:</h3>
      <ul>
        {selectedDates.map((date, index) => (
          <li key={index}>
            {date} <button onClick={() => removeDate(date)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleGetData()}>Get Data</button>
      <h3>Final Selected Dates (Array):</h3>
      <pre>{JSON.stringify(selectedDates, null, 2)}</pre>
      <div style={style}>
        {data.map((rec) => (
          <div>
            {rec.Branch},
            <span style={{ fontWeight: "bold" }}>{rec["Invoice Date"]}</span>,
            {rec.bpcode},{rec.bpName},{rec.ItemName},{rec.ItemTotal},
            <span style={{ fontWeight: "bold" }}>
              {rec.salesEmp},{rec.review}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
