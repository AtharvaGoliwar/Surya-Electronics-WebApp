import React, { useState } from "react";
import "./Employee_Profiles.css";
import Sidebar from "./sidebar";
import data from "../data/data.json";
import axios from "axios";

function Employee_Profiles() {
  const [empNameInput, setEmpNameInput] = useState("");
  const [currentEmp, setCurrentEmp] = useState("");
  // const [empData, setEmpData] = useState([]);
  const [details, setDetails] = useState({});
  const [isSearch, setIsSearch] = useState(false);
  let userInput = "";
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleEmpNameChange = (e) => {
    setEmpNameInput(e.target.value);
  };

  const addEmpName = async (e) => {
    e.preventDefault();
    if (!empNameInput) {
      alert("Please enter an Employee name before adding.");
      return;
    }
    // const filtered = data.filter(
    //   (item) => item["salesEmp"].toLowerCase() === empNameInput.toLowerCase()
    // );
    // // setEmpData([...empData, { empName: empNameInput, data: filtered }]);
    // setDetails((prevDetails) => ({
    //   ...prevDetails,
    //   [empNameInput]: filtered,
    // }));
    try {
      const params = { user: empNameInput };
      const res = await axios.get(`${url}/getuserinfo`, {
        params,
        withCredentials: true,
      });
      setDetails(res.data[0]);
      setIsSearch(true);
    } catch (err) {
      console.log(err);
    }
    setCurrentEmp(empNameInput);
    setEmpNameInput("");
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
                Employee Profiles
              </h3>
              <form id="add-emp-form">
                <input
                  type="text"
                  placeholder="Enter Employee Name"
                  value={empNameInput}
                  onChange={handleEmpNameChange}
                  required
                  className="emp-input"
                  style={{
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "1px solid #000",
                    borderRadius: "4px",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                />
                <button className="btn" onClick={addEmpName}>
                  Add Employee ID
                </button>
              </form>
              <div className="results">
                <div
                  className="emp-entry"
                  style={!isSearch ? { display: "none" } : { display: "block" }}
                >
                  <div className="emp-header">
                    <h4>Emp ID: {currentEmp}</h4>
                  </div>
                  {details ? (
                    <div className="result-item">
                      <p>
                        <b>Name: </b>
                        {details.name}
                      </p>
                      <p>
                        <b>Emp ID: </b>
                        {details.userId}
                      </p>
                      <p>
                        <b>Password:</b>
                        {details.password}
                      </p>
                      <p>
                        <b>Role: </b>
                        {details.role}
                      </p>
                      <p>
                        <b>Phone Number: </b>
                        {details.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="result-item">
                      No data available for this Employee ID
                    </p>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default Employee_Profiles;
