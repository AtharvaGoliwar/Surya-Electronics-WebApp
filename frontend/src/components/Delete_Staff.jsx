import React, { useState } from "react";
import axios from "axios";
import "./Delete_Staff.css";
import Sidebar from "./sidebar";

function StaffDeletionForm() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState("");
  const [passwd, setPasswd] = useState("");
  const [name, setName] = useState("");
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleDeleteClick = (e) => {
    // Perform deletion logic (e.g., call an API to delete staff record)
    // You can pass the staffId to your backend for deletion
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    // Perform actual deletion (e.g., call an API)
    try {
      const params = { user: user, passwd: passwd };
      let res1 = await axios.get(`${url}/usercheck`, {
        params,
        withCredentials: true,
      });
      if (res1.data.length === 0) {
        alert("Enter valid user details to delete the user");
        setShowModal(false);
        return;
      }
      console.log(
        res1.data[0]["userId"],
        res1.data[0]["password"],
        res1.data[0]["role"]
      );
      const role = res1.data[0]["role"];
      if (
        res1.data[0]["userId"] === user &&
        res1.data[0]["password"] === passwd
      ) {
        await axios.delete(`${url}/deleteUser`, {
          data: { user, passwd, role },
          withCredentials: true,
        });
        alert("Successfully deleted user", user);
      }
      setUser("");
      setPasswd("");
      setName("");
    } catch (err) {
      console.log(err);
    }

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
                  Staff Deletion
                </h3>

                <form id="add-user-form">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={passwd}
                    onChange={(e) => setPasswd(e.target.value)}
                    required
                  />

                  <button
                    type="submit"
                    className="btn"
                    onClick={handleDeleteClick}
                  >
                    Delete
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
                    Delete Confirmation
                  </h3>
                  <p style={{ color: "black", textAlign: "center" }}>
                    Are you sure you want to delete this staff member?
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
                      onClick={handleConfirmDelete}
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
                      Delete
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

export default StaffDeletionForm;
