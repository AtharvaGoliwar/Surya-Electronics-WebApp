import React, { useEffect, useState } from "react";
import "./Customer_Feedback.css";
import axios from "axios";
import Sidebar from "./sidebar";
// import data from "../data/data.json";

function Customer_Feedback() {
  const [dateInput, setDateInput] = useState("");
  const [datesData, setDatesData] = useState([]);
  const [data, setData] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      const params = { date: [] };
      try {
        let res = await axios.get(`${url}/alldata`, {
          withCredentials: true,
        });
        const responseData = res.data;
        setData(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (e) => {
    setDateInput(e.target.value);
  };

  const addDate = (e) => {
    e.preventDefault();
    console.log(data);
    if (!dateInput) {
      alert("Please enter a date before adding.");
      return;
    }
    const filtered = data.filter((item) => item["Invoice Date"] === dateInput);
    setDatesData([...datesData, { date: dateInput, data: filtered }]);
    setDateInput("");
    console.log(datesData);
  };

  const deleteDate = (index) => {
    const updatedDates = datesData.filter((_, i) => i !== index);
    setDatesData(updatedDates);
  };

  const handleSend = async () => {
    try {
      const res = await axios.get("http://localhost:8800/users", {
        withCredentials: true,
      });
      let users = [];

      // for (let i = 0; i < datesData.length; i++) {
      //   // if (!users.includes(datesData[i]["salesEmp"])) {
      //   //   users.push(data[i]["salesEmp"]);
      //   // }
      //   for (let j = 0; j < datesData[i]["data"].length; j++) {
      //     console.log(datesData[i]["data"][j]["salesEmp"]);
      //     if (!users.includes(datesData[i]["data"][j]["salesEmp"])) {
      //       users.push(datesData[i]["data"][j]["salesEmp"]);
      //     }
      //   }
      // }
      for (let i = 0; i < res.data.length; i++) {
        users.push(res.data[i]["userId"]);
      }

      // console.log(res?.data.length);
      console.log(users.length);
      console.log(users);
      // const formattedDate = date.toISOString().split("T")[0];
      // console.log(formattedDate);
      console.log(datesData);
      let selectedDates = [];
      for (let i = 0; i < datesData.length; i++) {
        selectedDates[i] = datesData[i]["date"];
      }
      for (let i = 0; i < users.length; i++) {
        console.log("hel");
        const params = { empid: users[i] };
        const res3 = await axios.get(`${url}/emp`, {
          params,
          withCredentials: true,
        });
        let empData = res3.data;
        if (empData.some((item) => item.review !== "")) {
          let res2 = await axios.post(
            `${url}/truncateTable`,
            {
              userId: users[i],
            },
            { withCredentials: true }
          );
        }

        let res1 = await axios.post(
          `${url}/send`,
          {
            userId: users[i],
            date: selectedDates,
          },
          { withCredentials: true }
        );
      }
      alert("Data sent successfully");
      //   let res1 = await axios.post("http://localhost:8800/send", {
      //     userId: "123",
      //   });
      //   let res2 = await axios.post("http://localhost:8800/send", {
      //     userId: "123",
      //   });
    } catch (err) {
      console.log(err);
    }

    // const allData = datesData.flatMap((dateEntry) => dateEntry.data);
    // console.log("Sending data:", allData);
  };

  return (
    <>
      {console.log(datesData)}
      <div style={{ display: "flex", marginLeft: 200 }}>
        <Sidebar />
        <div>
          <div className="user-management-container">
            <main className="main-content">
              <header></header>
              <section className="form-section">
                <h3 style={{ color: "black", textAlign: "center" }}>
                  Send Data
                </h3>
                <div id="add-user-form">
                  <input
                    type="date"
                    value={dateInput}
                    onChange={handleDateChange}
                    className="date-picker"
                    style={{
                      backgroundColor: "#333",
                      color: "#fff",
                      border: "1px solid #000",
                      borderRadius: "4px",
                      padding: "10px",
                      fontSize: "16px",
                    }}
                  />
                  <button className="btn" onClick={addDate}>
                    Add Date
                  </button>
                  {datesData.length > 0 && (
                    <button className="btn" onClick={handleSend}>
                      Send Data
                    </button>
                  )}
                </div>
                <div className="results">
                  {datesData.map((dateEntry, index) => (
                    <div key={index} className="date-entry">
                      <div className="date-header">
                        <h4>Date: {dateEntry.date}</h4>
                        <button onClick={() => deleteDate(index)}>
                          Delete
                        </button>
                      </div>
                      {dateEntry.data.length > 0 ? (
                        dateEntry.data.map((item, i) => (
                          <div key={i} className="result-item">
                            <p>Sales Employee: {item.salesEmp}</p>
                            <p>Branch: {item.Branch}</p>
                            <p>Invoice Date: {item["Invoice Date"]}</p>
                            <p>BP Code: {item.bpcode}</p>
                            <p>BP Name: {item.bpName}</p>
                            <p>Mobile Phone: {item["Mobile Phone"]}</p>
                            <p>Item Name: {item.ItemName}</p>
                            <p>Sales Emp: {item.salesEmp}</p>
                            <p>Item Total: {item.ItemTotal}</p>
                          </div>
                        ))
                      ) : (
                        <p className="result-item">
                          No data available for this date.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default Customer_Feedback;
