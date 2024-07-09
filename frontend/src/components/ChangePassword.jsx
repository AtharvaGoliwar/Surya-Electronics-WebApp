import React, { useState } from "react";
import axios from "axios";
import "./ChangePassword.css";
import Sidebar from "./sidebar";

function ChangePassword() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState("");
  const [newpasswd, setNewPasswd] = useState("");

  const handleChangePasswordClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmChangePassword = async () => {
    try {
      const params = { user: user, newpasswd: newpasswd };
      await axios.post(
        "http://localhost:8800/changePassword",
        { user: user, newpasswd: newpasswd },
        { withCredentials: true }
      );
      setUser("");
      setNewPasswd("");
    } catch (err) {
      console.log(err);
    }
    console.log(user);
    console.log(newpasswd);
    setShowModal(false);
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: 200 }}>
        <Sidebar />
        <div>
          <div className="user-management-container">
            <main className="main-content">
              <header></header>

              <section className="form-section">
                <h3 style={{ color: "black", textAlign: "center" }}>
                  Change Password
                </h3>

                <form id="change-password-form">
                  <input
                    type="text"
                    placeholder="Username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={newpasswd}
                    onChange={(e) => setNewPasswd(e.target.value)}
                    required
                  />

                  <button
                    type="submit"
                    className="btn"
                    onClick={handleChangePasswordClick}
                  >
                    Change Password
                  </button>
                </form>
              </section>
            </main>
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-container">
                  <span
                    className="modal-close"
                    onClick={() => setShowModal(false)}
                  >
                    &times;
                  </span>

                  <h3 style={{ color: "black", textAlign: "center" }}>
                    Confirm Password Change
                  </h3>
                  <p style={{ color: "black", textAlign: "center" }}>
                    Are you sure you want to change the password for this user?
                  </p>

                  <div className="button-container">
                    <button
                      variant="default"
                      onClick={() => setShowModal(false)}
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
                      onClick={handleConfirmChangePassword}
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
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
