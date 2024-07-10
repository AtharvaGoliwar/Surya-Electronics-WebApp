import React from "react";
import "./Logout.css";
import Sidebar from "./sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;
  const handleLogout = async () => {
    try {
      await axios.post(`${url}/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* <Sidebar /> */}
      {/* {showModal} */}
      <div className="modal-overlay">
        <div className="modal-container">
          <span className="modal-close" onClick={() => navigate("/")}>
            &times;
          </span>

          <h3 style={{ color: "black", textAlign: "center" }}>
            Logout Confirmation
          </h3>
          <p style={{ color: "black", textAlign: "center" }}>
            Are you sure you want to logout?
          </p>

          <div className="button-container">
            <button
              variant="default"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                marginRight: "5px",
              }}
            >
              Cancel
            </button>
            <button
              variant="danger"
              onClick={handleLogout}
              classname="logoutBut"
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
