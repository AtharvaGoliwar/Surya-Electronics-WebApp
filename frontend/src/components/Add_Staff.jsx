import React from "react";
import Sidebar from "./sidebar";
import "./Add_Staff.css";
import { useState } from "react";
import axios from "axios";

function StaffRegistrationForm() {
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [branch, setBranch] = useState("");
  const url = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e) => {
    e?.preventDefault();
    // alert(user);
    // alert(passwd);
    // alert(role);
    // alert(name);
    // alert(number);
    const userDetails = {
      userId: user,
      password: passwd,
      role: role,
      name: name,
      number: number,
      branch: branch, //here is the new line added
    };
    try {
      await axios.post(`${url}/addUser`, userDetails, {
        withCredentials: true,
      });
      const res = await axios.post(
        `${url}/createTable`,
        {
          user: user,
          role: role,
        },
        { withCredentials: true }
      );
      console.log(res.data.message);
      // navigate("/");
      alert("User Added Successfully");
      setName("");
      setNumber("");
      setPasswd("");
      // setRole("");
      setUser("");
    } catch (err) {
      console.log(err);
      console.error("Error creating table:", err);
    }
  };
  return (
    <div style={{ display: "flex", marginLeft: 200 }}>
      <Sidebar />
      <div>
        <div className="user-management-container">
          <main className="main-content">
            <header></header>

            <section className="form-section">
              <h3 style={{ color: "black", textAlign: "center" }}>
                Staff Registeration
              </h3>

              <form id="add-user-form">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {/* <input type="text" placeholder="Last Name" /> */}
                {/* <select onChange={(e) => setBranch(e.target.value)}>
                  <option disabled selected value={""}>
                    Select Branch
                  </option>
                  <option value={"CWD"}>Chinchwad (CWD)</option>
                  <option value={"WKD"}>Wakad (WKD)</option>
                  <option value={"CHKN"}>Chakan (CHKN)</option>
                  <option value={"NRGN"}>Narayangaon (NRGN)</option>
                  <option value={"DHR"}>Dhayari (DHR)</option>
                  <option value={"MCHR"}>Manchar (MCHR)</option>
                  <option value={"BHS"}>Bhosari (BHS)</option>
                  <option value={"PLTN"}>Phaltan (PLTN)</option>
                  <option value={"MNKBG"}>Manikbaug (MNKBG)</option>
                  <option value={"SRR"}>Shirur (SRR)</option>
                  <option value={"RGNR"}>Rajgurunagar (RGNR)</option>
                </select> */}

                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Phone Number"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter Password"
                  required
                  value={passwd}
                  onChange={(e) => setPasswd(e.target.value)}
                />

                <select onChange={(e) => setRole(e.target.value)}>
                  <option value={""} disabled selected>
                    Select Role
                  </option>
                  <option value={"employee"}>Sales Man</option>
                  <option value={"admin"}>Admin</option>
                </select>
              </form>
              <button
                type="submit"
                className="btn"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>

              {/*<section className='popup-container'>
            <h3>Hello</h3>


          </section>*/}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StaffRegistrationForm;
