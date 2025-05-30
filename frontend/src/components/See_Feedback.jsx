import React, { useState, useEffect } from "react";
import axios from "axios";
import "./See_Feedback.css";
import Sidebar from "./sidebar";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import data from "../data/data.json";
import data1 from "../data/data1.json";

function See_Feedback() {
  const [employeeInput, setEmployeeInput] = useState("");
  const [employeesData, setEmployeesData] = useState([]);
  const [records, setRecords] = useState({});
  const url = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`${url}/users`, {
          withCredentials: true,
        });
        const newRecords = {};

        for (let i = 0; i < res?.data.length; i++) {
          if (res.data[i]["role"] !== "admin") {
            const employee = res.data[i]["userId"];
            const params = { empid: res.data[i]["userId"] };
            const res1 = await axios.get(`${url}/emp`, {
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

  const handleEmployeeChange = (e) => {
    setEmployeeInput(e.target.value);
  };

  const addEmployee = (e) => {
    e.preventDefault();
    if (!employeeInput) {
      alert("Please enter an employee name before adding.");
      return;
    }
    const filtered = data.filter(
      (item) => item["salesEmp"].toLowerCase() === employeeInput.toLowerCase()
    );
    setEmployeesData([...employeesData, employeeInput]);
    let newRec = {};
    // newRec[employeeInput] = data1[employeeInput]
    // setRecords(prevRec => ({
    //     ...prevRec,
    //     [employeeInput]:data1[0][employeeInput]
    // }))
    setEmployeeInput("");
  };

  const deleteEmployee = (index) => {
    const updatedEmployees = employeesData.filter((_, i) => i !== index);
    setEmployeesData(updatedEmployees);
    console.log("hello");
    // setRecords(prevRec=>{
    //     const newRec = {...prevRec}
    //     delete newRec[index]
    //     return newRec
    // })
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${url}/finalreview`, records, {
        withCredentials: true,
      });
      alert("Final Data updated successfully");
    } catch (err) {
      console.log(err);
    }
    console.log("Update button clicked");
  };

  const handleFileDownload = async (e) => {
    e.preventDefault();
    let jsonData = [];
    const dateColumnHeader = "Invoice Date";
    try {
      let res = await axios.get(`${url}/alldata`, {
        withCredentials: true,
      });
      jsonData = res.data;
      console.log(jsonData);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Add headers
      const headers = Object.keys(jsonData[0]);
      worksheet.addRow(headers);

      // Find the index of the date column
      const dateColumnIndex = headers.indexOf(dateColumnHeader);
      if (dateColumnIndex === -1) {
        console.error("Date column not found");
        return;
      }

      // Add rows
      // jsonData.forEach((row) => {
      //   worksheet.addRow(Object.values(row));
      // });

      // Add rows
      jsonData.forEach((row) => {
        const values = headers.map((header) => row[header]);
        worksheet.addRow(values);
      });

      // Apply date formatting to the specified date column
      worksheet.getColumn(dateColumnIndex + 1).eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          // Skip header row
          const date = new Date(cell.value);
          if (!isNaN(date.getTime())) {
            cell.value = date;
            cell.numFmt = "yyyy-mm-dd";
          }
        }
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // Save the file
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "data.xlsx");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: 200 }}>
        <Sidebar />
        <div className="user-management-container">
          <main className="main-content">
            <header></header>
            <section className="form-section">
              <h3 style={{ color: "black", textAlign: "center" }}>
                See Feedback
              </h3>
              <form id="add-employee-form">
                {/* <input
                  type="text"
                  placeholder="Enter Employee Name"
                  value={employeeInput}
                  onChange={handleEmployeeChange}
                  required
                  className="employee-input"
                  style={{
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "1px solid #000",
                    borderRadius: "4px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                /> */}
                <select
                  onChange={handleEmployeeChange}
                  style={{
                    height: 40,
                    borderRadius: "4px",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "1px solid #000",
                  }}
                >
                  <option disabled selected>
                    Select Employee
                  </option>
                  {Object.keys(records).map((rec) => (
                    <option value={rec}>{rec}</option>
                  ))}
                </select>

                <button className="btn" onClick={addEmployee}>
                  Add Employee
                </button>
                <div className="button-group">
                  <button className="update-btn" onClick={handleUpdate}>
                    Update
                  </button>
                  <button className="download-btn" onClick={handleFileDownload}>
                    Download
                  </button>
                </div>
              </form>
              <div className="results">
                {employeesData.map((employeeEntry, index) => (
                  <div key={index} className="employee-entry">
                    <div
                      className={`employee-header ${
                        records[employeeEntry] &&
                        records[employeeEntry].some((item) => !item.review)
                          ? "highlight"
                          : ""
                      }`}
                    >
                      <h4>Employee: {employeeEntry}</h4>
                      <h2
                        className={`check ${
                          records[employeeEntry] &&
                          records[employeeEntry].some((item) => !item.review)
                            ? "highlight"
                            : ""
                        }`}
                        // style={{ display: "none" }}
                        style={
                          records[employeeEntry] &&
                          records[employeeEntry].some((item) => !item.review)
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        TASK NOT COMPLETED
                      </h2>
                      <button onClick={() => deleteEmployee(index)}>
                        Delete
                      </button>
                    </div>
                    {records[employeeEntry] &&
                    records[employeeEntry].length > 0 ? (
                      records[employeeEntry].map((item, i) => (
                        <div key={i} className="result-item">
                          <p>
                            <b>Branch: </b>
                            {item.Branch}
                          </p>
                          <p>
                            <b>Invoice Date: </b>
                            {item["Invoice Date"]}
                          </p>
                          <p>
                            <b>Customer Name: </b>
                            {item.bpName}
                          </p>
                          <p>
                            <b>Mobile Phone: </b>
                            {item["Mobile Phone"]}
                          </p>
                          <p>
                            <b>Item Name: </b>
                            {item.ItemName}
                          </p>
                          <p>
                            <b>Sales Emp: </b>
                            {item.salesEmp}
                          </p>
                          <p>
                            <b>Item Total: </b>
                            {item.ItemTotal}
                          </p>
                          <p>
                            <b>Customer Review: </b>
                            <b>
                              <i>{item.review}</i>
                            </b>
                          </p>
                          <p>
                            <b>Customer Feedback: </b>
                            <b>
                              <i>{item.description}</i>
                            </b>
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="result-item">
                        No data available for this employee.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default See_Feedback;
