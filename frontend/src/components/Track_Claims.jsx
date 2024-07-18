import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Track_Claims.css";
import Sidebar from "./sidebar";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function Track_Claims() {
  const [employeeNameInput, setEmployeeNameInput] = useState("");
  const [branchInput, setBranchInput] = useState("");
  const [employeesData, setEmployeesData] = useState("");
  const [records, setRecords] = useState({});

  const [incentiveRecords, setIncentiveRecords] = useState([]);
  const [emp, setEmp] = useState([]);
  const [displayRec, setDisplayRec] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8800/users", {
  //         withCredentials: true,
  //       });
  //       const newRecords = {};

  //       for (let i = 0; i < res?.data.length; i++) {
  //         if (res.data[i]["role"] !== "admin") {
  //           const employee = res.data[i]["userId"];
  //           const params = { empid: res.data[i]["userId"] };
  //           const res1 = await axios.get("http://localhost:8800/emp", {
  //             params,
  //             withCredentials: true,
  //           });
  //           newRecords[employee] = res1.data;
  //         }
  //       }

  //       setRecords(newRecords);
  //       console.log(newRecords);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchRecords();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(`${url}/incentiveAllData`, {
          withCredentials: true,
        });
        let users = [];
        console.log(res.data);
        res.data.map((rec) => {
          if (!users.includes(rec.salesEmp)) {
            users.push(rec.salesEmp);
          }
        });
        setEmp(users);
        setIncentiveRecords(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleEmployeeNameChange = (e) => {
    setEmployeeNameInput(e.target.value);
  };

  const handleBranchChange = (e) => {
    setBranchInput(e.target.value);
  };

  const addEmployee = (e) => {
    e.preventDefault();
    if (!employeeNameInput) {
      alert("Please enter both employee name and branch before adding.");
      return;
    }
    // setEmployeesData([
    //   ...employeesData,
    //   { name: employeeNameInput, branch: branchInput },
    // ]);
    setEmployeesData(employeeNameInput);
    let temp = [];
    incentiveRecords.map((rec) => {
      if (rec.salesEmp === employeeNameInput) {
        temp.push(rec);
      }
    });
    setDisplayRec(temp);

    setEmployeeNameInput("");
    setBranchInput("");
  };

  const deleteEmployee = (index) => {
    const updatedEmployees = employeesData.filter((_, i) => i !== index);
    setEmployeesData(updatedEmployees);
  };

  // const handleUpdate = async () => {
  //   try {
  //     await axios.post("http://localhost:8800/finalreview", records, {
  //       withCredentials: true,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   console.log("Update button clicked");
  // };

  const handleFileDownload = async (e) => {
    e.preventDefault();
    let jsonData = incentiveRecords;
    const dateColumnHeader = "docDate";
    try {
      // let res = await axios.get("http://localhost:8800/alldata", {
      //   withCredentials: true,
      // });
      // jsonData = res.data;
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
      saveAs(blob, "data_incentive.xlsx");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {console.log(emp)}
      {console.log(displayRec)}
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
                {/* <input
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
                /> */}

                <select
                  onChange={handleEmployeeNameChange}
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
                  {emp.map((rec) => (
                    <option value={rec}>{rec}</option>
                  ))}
                </select>

                {/* <select
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
                </select> */}

                <button className="btn" onClick={addEmployee}>
                  Add Employee
                </button>
                <div className="button-group">
                  {/* <button className="update-btn" onClick={handleUpdate}>
                    Update
                  </button> */}
                  <button className="download-btn" onClick={handleFileDownload}>
                    Download
                  </button>
                </div>
              </form>
              {employeesData !== "" ? (
                <div className="results">
                  {/* {employeesData.map((employeeEntry, index) => ( */}
                  <div className="employee-entry">
                    <div className="employee-header">
                      <h4>Employee: {employeesData}</h4>
                      {/* <button onClick={() => deleteEmployee(index)}>
                        Delete
                      </button> */}
                    </div>
                    {emp && displayRec.length > 0 ? (
                      displayRec.map((item, i) => (
                        <div key={i} className="result-item">
                          <p>
                            <b>SNLC:</b> {item.SNLC}
                          </p>
                          <p>
                            <b>SELLING PRICES:</b> {item["sellingPrice"]}
                          </p>
                          <p>
                            <b>SNLC/ONLINE/EW:</b> {item["typeSelling"]}
                          </p>
                          <p>
                            <b>INSENTIVE TYPE:</b> {item["incentiveType"]}
                          </p>
                          <p>
                            <b>SRP QTY:</b> {item["SRPQty"]}
                          </p>
                          <p>
                            <b>Incentive Total:</b> {item["incentiveTotal"]}
                          </p>
                          <p>
                            <b>REMARK:</b> {item.remark}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="result-item">
                        No data available for this employee.
                      </p>
                    )}
                  </div>
                  {/* ))} */}
                </div>
              ) : (
                ""
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default Track_Claims;
