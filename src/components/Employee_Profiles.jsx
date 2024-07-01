import React, { useState } from 'react';
import './Employee_Profiles.css';
import Sidebar from './sidebar';
import data from "../data/data.json";

function Employee_Profiles() {
  const [bpNameInput, setBpNameInput] = useState('');
  const [bpData, setBpData] = useState([]);
  const [details, setDetails] = useState({});

  const handleBpNameChange = (e) => {
    setBpNameInput(e.target.value);
  };

  const addBpName = (e) => {
    e.preventDefault();
    if (!bpNameInput) {
      alert("Please enter an Employee name before adding.");
      return;
    }
    const filtered = data.filter(item => item["bpName"].toLowerCase() === bpNameInput.toLowerCase());
    setBpData([...bpData, { bpName: bpNameInput, data: filtered }]);
    setDetails(prevDetails => ({
      ...prevDetails,
      [bpNameInput]: filtered
    }));
    setBpNameInput('');
  };

  const deleteBpName = (bpName) => {
    const updatedBpData = bpData.filter(item => item.bpName !== bpName);
    setBpData(updatedBpData);
    setDetails(prevDetails => {
      const newDetails = { ...prevDetails };
      delete newDetails[bpName];
      return newDetails;
    });
  };

  return (
    <>
      <div style={{ display: "flex", marginLeft: 200 }}>
        <Sidebar />
        <div className='user-management-container'>
          <main className="main-content">
            <header></header>
            <section className="form-section">
              <h3 style={{ color: 'black', textAlign: 'center' }}>Employee Profiles</h3>
              <form id="add-bp-form">
                <input
                  type="text"
                  placeholder="Enter Employee Name"
                  value={bpNameInput}
                  onChange={handleBpNameChange}
                  required
                  className="bp-input"
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    padding: '10px',
                    fontSize: '16px'
                  }}
                />
                <button className='btn' onClick={addBpName}>Add BP Name</button>
              </form>
              <div className="results">
                {Object.keys(details).map((bpEntry, index) => (
                  <div key={index} className="bp-entry">
                    <div className="bp-header">
                      <h4>BP Name: {bpEntry}</h4>
                      <button onClick={() => deleteBpName(bpEntry)}>Delete</button>
                    </div>
                    {details[bpEntry] ? (
                      details[bpEntry].map((item, i) => (
                        <div key={i} className="result-item">
                          <p><b>Mobile Number: </b>{item.MobileNumber}</p>
                          <p><b>BP Code: </b>{item.bpcode}</p>
                          <p><b>BP Name: </b>{item.bpName}</p>
                          <p><b>Sales Employee: </b>{item.salesEmp}</p>
                        </div>
                      ))
                    ) : (
                      <p className='result-item'>No data available for this BP name.</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default Employee_Profiles;
