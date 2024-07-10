import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EmpSidebar.css";

function EmpSidebar({ empName }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="emp-container">
      <aside className="emp-sidebar">
        <nav>
          <img
            src="/logo_no_bg.png"
            alt="logo"
            width="70"
            height="35"
            onClick={() => navigate("/")}
            style={{ marginLeft: "10px" }}
          ></img>
          <a className="active">Employee</a>
          <a className="active">{empName}</a>
          <a onClick={() => navigate("/Logout")} className="active">
            Logout
          </a>
        </nav>
      </aside>
    </div>
  );
}

export default EmpSidebar;
