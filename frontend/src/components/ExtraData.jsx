import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import axios from "axios";
// import data from "../data/data.json";

import "./ExtraData.css";

function Del_Staff_Data() {
  const [bpNameInput, setBpNameInput] = useState("");
  const [detailsList, setDetailsList] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const [staffNameInput, setStaffNameInput] = useState("");
  const [staffDetailsList, setStaffDetailsList] = useState([]);
  const [staffSearchAttempted, setStaffSearchAttempted] = useState(false);

  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [next, setNext] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${url}/deletedemp`, {
          withCredentials: true,
        });
        console.log(res.data);
        let retrievedData = {};
        let abc = [];
        for (let i = 0; i < res.data.length; i++) {
          retrievedData[res.data[i]] = [];
        }
        for (let i = 0; i < res.data.length; i++) {
          abc.push(res.data[i]);
          // console.log(res.data[i]);
          try {
            const params = { empid: res.data[i] };
            const res1 = await axios.get(`${url}/emp`, {
              params,
              withCredentials: true,
            });
            for (let j = 0; j < res1.data.length; j++) {
              console.log("check");
              retrievedData[res.data[i]].push(res1.data[j]);
            }
          } catch (err) {
            console.log(err);
          }
        }
        setData(retrievedData);
        setDeletedUsers(abc);
        setNext(!next);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`${url}/users`, {
          withCredentials: true,
        });
        console.log(res?.data);
        let updatedUsers = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i]["role"] !== "admin") {
            updatedUsers.push(res.data[i]["userId"]);
          }
        }
        setUsers(updatedUsers);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, [next]);

  const handleBpNameChange = (e) => {
    setBpNameInput(e.target.value);
  };

  const handleStaffNameChange = (e) => {
    setStaffNameInput(e.target.value);
  };

  const addBpName = (e) => {
    // e.preventDefault();
    // if (!bpNameInput) {
    //   alert("Please enter an Employee name before adding.");
    //   return;
    // }
    // if (
    //   detailsList.some(
    //     (item) => item.bpName.toLowerCase() === bpNameInput.toLowerCase()
    //   ) ||
    //   staffDetailsList.some(
    //     (item) => item.bpName.toLowerCase() === bpNameInput.toLowerCase()
    //   )
    // ) {
    //   alert("This name already exists in the list.");
    //   return;
    // }
    setSearchAttempted(true);
    // const filtered = data.filter(
    //   (item) => item["bpName"].toLowerCase() === bpNameInput.toLowerCase()
    // );
    // if (filtered.length > 0) {
    //   setDetailsList([...detailsList, filtered[0]]);
    // } else {
    //   setDetailsList([...detailsList, { bpName: bpNameInput, error: true }]);
    // }
    if (deletedUsers.includes(bpNameInput)) {
      if (detailsList.includes(bpNameInput)) {
        alert("User Already selected");
      } else {
        setDetailsList([...detailsList, bpNameInput]);
      }
    }
    setBpNameInput("");
    console.log(deletedUsers);
    console.log("hi");
  };

  const addStaffName = (empId) => {
    // e.preventDefault();
    // if (!staffNameInput) {
    //   alert("Please enter a Staff name before adding.");
    //   return;
    // }
    // if (
    //   detailsList.some(
    //     (item) => item.bpName.toLowerCase() === staffNameInput.toLowerCase()
    //   ) ||
    //   staffDetailsList.some(
    //     (item) => item.bpName.toLowerCase() === staffNameInput.toLowerCase()
    //   )
    // ) {
    //   alert("This name already exists in the list.");
    //   return;
    // }
    setStaffSearchAttempted(true);
    // const filtered = data.filter(
    //   (item) => item["bpName"].toLowerCase() === staffNameInput.toLowerCase()
    // );
    // if (filtered.length > 0) {
    //   setStaffDetailsList([...staffDetailsList, filtered[0]]);
    // } else {
    //   setStaffDetailsList([
    //     ...staffDetailsList,
    //     { bpName: staffNameInput, error: true },
    //   ]);
    // }
    // setStaffNameInput("");
    if (users.includes(empId)) {
      if (selectedUsers.includes(empId)) {
        alert("User Already selected");
      } else {
        setSelectedUsers((prevSelectedUsers) =>
          prevSelectedUsers.includes(empId)
            ? prevSelectedUsers.filter((n) => n !== empId)
            : [...prevSelectedUsers, empId]
        );
      }
    }
    setStaffNameInput("");
  };

  const deleteEntry = (index) => {
    setDetailsList(detailsList.filter((_, i) => i !== index));
  };

  const deleteStaffEntry = (index) => {
    // setStaffDetailsList(staffDetailsList.filter((_, i) => i !== index));
    setSelectedUsers(selectedUsers.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    let extradata = [];
    for (let i = 0; i < detailsList.length; i++) {
      data[detailsList[i]].map((item) => {
        extradata.push(item);
      });
    }
    // alert(
    //   "Sending staff names: " +
    //     staffDetailsList.map((details) => details.bpName).join(", ")
    // );
    console.log(extradata);
    console.log("Submitted Users: ", selectedUsers, selectedUsers.length);
    let updatedData = extradata;
    for (let i = 0; i < extradata.length; i++) {
      let dateObj = new Date(updatedData[i]["Invoice Date"]);
      updatedData[i]["Invoice Date"] = `${dateObj.getFullYear()}-${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
    }
    // setData(updatedData);
    console.log(updatedData);
    try {
      const res = await axios.post(
        `${url}/sendextradata`,
        {
          users: selectedUsers,
          data: updatedData,
        },
        { withCredentials: true }
      );
      alert("Extra Data sent successfully");
    } catch (err) {
      console.log(err);
    }
    // Here you can add the logic to send the staff names as needed
  };

  console.log(staffDetailsList);
  console.log(selectedUsers);
  console.log(detailsList);
  return (
    <div className="home-container">
      <Sidebar />
      {console.log(data)}

      <div className="main-con">
        <div className="deleted-staff-section">
          <h2 style={{ color: "black", textAlign: "center" }}>
            Deleted Employee Data
          </h2>
          <form id="add-bp-form">
            <input
              type="text"
              placeholder="Enter Employee Name"
              value={bpNameInput}
              onChange={handleBpNameChange}
              required
              className="bp-input"
              style={{
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #000",
                borderRadius: "4px",
                padding: "10px",
                fontSize: "16px",
              }}
            />
            <button className="btn" onClick={() => addBpName()}>
              Add Employee Data
            </button>
          </form>
          <div className="results">
            {detailsList.map((details, index) => (
              <div key={index} className="bp-entry">
                <div className="bp-header">
                  <h4 style={{ color: "black", display: "inline" }}>
                    Employee Name: {details}
                  </h4>
                  <button className="button" onClick={() => deleteEntry(index)}>
                    Delete
                  </button>
                  {console.log(data[details])}
                </div>
                {data[details].map((item, index) => (
                  <div className="result-item">
                    <p>
                      <b>Mobile Number: </b>
                      {item["Mobile Phone"]}
                    </p>
                    <p>
                      <b>BP Code: </b>
                      {item["bpcode"]}
                    </p>
                    <p>
                      <b>BP Name: </b>
                      {item["bpName"]}
                    </p>
                    <p>
                      <b>Sales Employee: </b>
                      {item["salesEmp"]}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="staff-section">
          <h2 style={{ color: "black", textAlign: "center" }}>Staff Names</h2>
          <form id="add-bp-form">
            <input
              type="text"
              placeholder="Enter Staff Name"
              value={staffNameInput}
              onChange={handleStaffNameChange}
              required
              className="bp-input"
              style={{
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #000",
                borderRadius: "4px",
                padding: "10px",
                fontSize: "16px",
              }}
            />
            <button
              className="btn"
              onClick={() => addStaffName(staffNameInput)}
            >
              Add Staff Name
            </button>
          </form>
          <div className="results">
            {selectedUsers.map((details, index) => (
              <div key={index} className="bp-entry">
                <div className="bp-header">
                  <div>
                    {/* {details.error ? (
                      <h3 style={{ color: "black" }}>
                        No employee named "{details.bpName}"
                      </h3>
                    ) : ( */}
                    <>
                      <h3 style={{ color: "black" }}>{details}</h3>
                    </>
                  </div>
                  <button
                    className="button"
                    onClick={() => deleteStaffEntry(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedUsers.length > 0 && (
            <button className="btn" onClick={handleSend}>
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Del_Staff_Data;
