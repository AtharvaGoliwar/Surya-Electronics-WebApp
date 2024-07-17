import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./sidebar.css";

function Sidebar() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <nav>
          <img
            src="logo_no_bg.png"
            alt="logo"
            width="100"
            height="50"
            onClick={() => navigate("")}
          ></img>
          <a className="active">Admin</a>
          <a onClick={() => navigate("/Employee_Profiles")} className="active">
            Employee Profiles
          </a>

          <div className="dropdown">
            <a className="active" onClick={toggleDropdown}>
              Staff Management
            </a>
            {isDropdownVisible && (
              <div className="dropdown-content">
                <a onClick={() => navigate("/Add_Staff")}>Add Staff</a>
                <a onClick={() => navigate("/Delete_Staff")}>Delete Staff</a>
                <a onClick={() => navigate("/Change_Password")}>
                  Change Password
                </a>
              </div>
            )}
          </div>

          <div className="dropdown">
            <a className="active" onClick={toggleDropdown}>
              Customer Feedback
            </a>
            {isDropdownVisible && (
              <div className="dropdown-content">
                <a onClick={() => navigate("/admin")}>Upload File</a>
                <a onClick={() => navigate("/Customer_Feedback")}>Send Data</a>
                <a onClick={() => navigate("/See_Feedback")}>See Feedback</a>
              </div>
            )}
          </div>

          <div className="dropdown">
            <a className="active" onClick={toggleDropdown}>
              Incentives
            </a>
            {isDropdownVisible && (
              <div className="dropdown-content">
                <a onClick={() => navigate("/admin")}>Upload File</a>
                {/* <a onClick={() => navigate("/Customer_Feedback")}>Send Data</a> */}
                <a onClick={() => navigate("/Track_Claims")}>Track Claims</a>
              </div>
            )}
          </div>

          {/* <a href="#Incentives" className="active">Incentives</a>
          <a href="#Daily Record" className="active">Daily Record</a>
          <a href="#Storage" className="active">Storage</a> */}
          <a onClick={() => navigate("/delemp")} className="active">
            Send Deleted Employee Data
          </a>
          <a onClick={() => navigate("/Logout")} className="active">
            Logout
          </a>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
