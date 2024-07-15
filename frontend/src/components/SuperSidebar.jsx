import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SuperSidebar.css";

function SuperSidebar() {
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
          <a className="active">Super Admin</a>
          <a className="active" onClick={() => navigate("/SuperEmpProfiles")}>
            Employee Profiles
          </a>
          <a className="active" onClick={() => navigate("/SuperAdmin")}>
            Upload File
          </a>
          <a className="active" onClick={() => navigate("/Logout")}>
            Logout
          </a>
        </nav>
      </aside>
    </div>
  );
}

export default SuperSidebar;
