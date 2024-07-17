import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Track_Claims.css";
import Sidebar from "./sidebar";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function Track_Claims() {
  const [employeeNameInput, setEmployeeNameInput] = useState("");
  const [branchInput, setBranchInput] = useState("");
  const [employeesData, setEmployeesData] = useState([]);
  const [records, setRecords] = useState({});

  useEffect(() => {
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

  const handleEmployeeNameChange = (e) => {
    setEmployeeNameInput(e.target.value);
  };

  const handleBranchChange = (e) => {
    setBranchInput(e.target.value);
  };

  const addEmployee = (e) => {
    e.preventDefault();
    if (!employeeNameInput || !branchInput) {
      alert("Please enter both employee name and branch before adding.");
      return;
    }
    setEmployeesData([
      ...employeesData,
      { name: employeeNameInput, branch: branchInput },
    ]);
    setEmployeeNameInput("");
    setBranchInput("");
  };

  const deleteEmployee = (index) => {
    const updatedEmployees = employeesData.filter((_, i) => i !== index);
    setEmployeesData(updatedEmployees);
  };

  const handleUpdate = async () => {
    try {
      await axios.post("http://localhost:8800/finalreview", records, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
    console.log("Update button clicked");
  };

  const handleFileDownload = async () => {
    let jsonData = [];
    try {
      let res = await axios.get("http://localhost:8800/alldata", {
        withCredentials: true,
      });
      jsonData = res.data;
      console.log(jsonData);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Add headers
      const headers = Object.keys(jsonData[0]);
      worksheet.addRow(headers);

      // Add rows
      jsonData.forEach((row) => {
        worksheet.addRow(Object.values(row));
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
                Track Claims
              </h3>
              <form id="add-employee-form">
                <input
                  type="text"
                  placeholder="Enter Employee Name"
                  value={employeeNameInput}
                  onChange={handleEmployeeNameChange}
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
                />

                <select
                  onChange={handleBranchChange}
                  style={{
                    height: 40,
                    borderRadius: "4px",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "1px solid #000",
                  }}
                >
                  <option disabled selected>
                    Select Branch
                  </option>
                  <option>Chinchwad (CHNWD)</option>
                  <option>Wakad (WKD)</option>
                  <option>Chakan (CKN)</option>
                  <option>Narayangaon (NRYNGN)</option>
                  <option>Dhayari (DYRI)</option>
                  <option>Manchar (MCHR)</option>
                  <option>Bhosari (BSRI)</option>
                  <option>Phaltan (PLTN)</option>
                  <option>Manikbaug (MNKBG)</option>
                  <option>Shirur (SRR)</option>
                  <option>Rajgurunagar (RGNGR)</option>
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
                    <div className="employee-header">
                      <h4>
                        Employee: {employeeEntry.name}, Branch:{" "}
                        {employeeEntry.branch}
                      </h4>
                      <button onClick={() => deleteEmployee(index)}>
                        Delete
                      </button>
                    </div>
                    {records[employeeEntry.name] &&
                    records[employeeEntry.name].length > 0 ? (
                      records[employeeEntry.name].map((item, i) => (
                        <div key={i} className="result-item">
                          <p>
                            <b>SNLC:</b> {item.SNLC}
                          </p>
                          <p>
                            <b>SELLING PRICES:</b> {item["SELLING PRICES"]}
                          </p>
                          <p>
                            <b>SNLC/ONLINE/EW:</b> {item["SNLC/ONLINE/EW"]}
                          </p>
                          <p>
                            <b>INSENTIVE TYPE:</b> {item["INSENTIVE TYPE"]}
                          </p>
                          <p>
                            <b>SRP QTY:</b> {item["SRP QTY"]}
                          </p>
                          <p>
                            <b>REMARK:</b> {item.REMARK}
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

export default Track_Claims;
