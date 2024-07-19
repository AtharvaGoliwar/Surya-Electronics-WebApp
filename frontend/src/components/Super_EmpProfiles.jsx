import React, { useEffect, useState } from "react";
import "./Super_EmpProfiles.css";
import SuperSidebar from "./SuperSidebar";
import axios from "axios";

function SuperEmpProfiles() {
  const [empNameInput, setEmpNameInput] = useState("");
  const [currentEmp, setCurrentEmp] = useState("");
  // const [empData, setEmpData] = useState([]);
  const [details, setDetails] = useState([]);
  const [currentRec, setCurrentRec] = useState({});
  const [isSearch, setIsSearch] = useState(false);
  const [isIn, setIsIn] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;
  let userInput = "";

  useEffect(() => {
    const getAllData = async () => {
      try {
        // const params = { user: empNameInput };
        const res = await axios.get(`${url}/allusers`, {
          withCredentials: true,
        });
        setDetails(res.data);
        // setIsSearch(true);
      } catch (err) {
        console.log(err);
      }
    };
    getAllData();
  }, []);

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
    for (let i = 0; i < details.length; i++) {
      if (details[i]["userId"] === empNameInput) {
        console.log(details[i]);
        setCurrentRec(details[i]);
        setIsIn(true);
      }
    }
    if (!isIn) {
      setCurrentEmp({});
    }
    setIsSearch(true);
    setCurrentEmp(empNameInput);
    setEmpNameInput("");
  };

  return (
    <>
      {console.log(details)}
      {console.log(currentRec)}
      <div style={{ display: "flex", marginLeft: 200 }}>
        <SuperSidebar />
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
                  {Object.keys(currentRec).length > 0 ? (
                    <div className="result-item">
                      <p>
                        <b>Name: </b>
                        {currentRec.name}
                      </p>
                      <p>
                        <b>Emp ID: </b>
                        {currentRec.userId}
                      </p>
                      <p>
                        <b>Role: </b>
                        {currentRec.role}
                      </p>
                      <p>
                        <b>Phone Number: </b>
                        {currentRec.phone}
                      </p>
                      <p>
                        <b>Password: </b>
                        {currentRec.password}
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

export default SuperEmpProfiles;
