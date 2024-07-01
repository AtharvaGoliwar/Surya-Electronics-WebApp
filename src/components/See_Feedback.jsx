import React, { useState } from 'react';
import './See_Feedback.css';
import Sidebar from './sidebar';
import data from "../data/data.json";
import data1 from "../data/data1.json"

function See_Feedback() {
    const [employeeInput, setEmployeeInput] = useState('');
    const [employeesData, setEmployeesData] = useState([]);
    const [records, setRecords] = useState({})

    const handleEmployeeChange = (e) => {
        setEmployeeInput(e.target.value);
    };

    const addEmployee = (e) => {
        e.preventDefault();
        if (!employeeInput) {
            alert("Please enter an employee name before adding.");
            return;
        }
        const filtered = data.filter(item => item["salesEmp"].toLowerCase() === employeeInput.toLowerCase());
        setEmployeesData([...employeesData, { employee: employeeInput, data: filtered }]);
        let newRec = {}
        // newRec[employeeInput] = data1[employeeInput]
        setRecords(prevRec => ({
            ...prevRec,
            [employeeInput]:data1[0][employeeInput]
        }))
        setEmployeeInput('');
    };

    const deleteEmployee = (index) => {
        const updatedEmployees = employeesData.filter((_, i) => i !== index);
        // setEmployeesData(updatedEmployees);
        setRecords(prevRec=>{
            const newRec = {...prevRec}
            delete newRec[index]
            return newRec
        })
    };

    const handleUpdate = () => {
        
        console.log("Update button clicked");
    };

    const handleDownload = () => {
        
        console.log("Download button clicked");
    };

    return (
        <>
            <div style={{ display: "flex", marginLeft: 200 }}>
                <Sidebar />
                <div className='user-management-container'>
                    <main className="main-content">
                        <header></header>
                        <section className="form-section">
                            <h3 style={{ color: 'black', textAlign: 'center' }}>See Feedback</h3>
                            <form id="add-employee-form">
                                <input
                                    type="text"
                                    placeholder="Enter Employee Name"
                                    value={employeeInput}
                                    onChange={handleEmployeeChange}
                                    required
                                    className="employee-input"
                                    style={{
                                        backgroundColor: '#333',
                                        color: '#fff',
                                        border: '1px solid #000',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        fontSize: '16px'
                                    }}
                                />
                                <button className='btn' onClick={addEmployee}>Add Employee</button>
                                <div className="button-group">
                                    <button className='update-btn' onClick={handleUpdate}>Update</button>
                                    <button className='download-btn' onClick={handleDownload}>Download</button>
                                </div>
                            </form>
                            <div className="results">
                                {Object.keys(records).map((employeeEntry, index) => (
                                    <div key={index} className="employee-entry">
                                        <div className="employee-header">
                                            <h4>Employee: {employeeEntry}</h4>
                                            <button onClick={() => deleteEmployee(employeeEntry)}>Delete</button>
                                        </div>
                                        {records[employeeEntry] ? (
                                            records[employeeEntry].map((item, i) => (
                                                <div key={i} className="result-item">
                                                    <p><b>Customer Name: </b>{item.bpName}</p>
                                                    <p><b>Item Name: </b>{item.ItemName}</p>
                                                    <p><b>Brand: </b>{item.Brand}</p>
                                                    <p><b>Customer Feedback: </b><b><i>{item.review}</i></b></p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className='result-item'>No data available for this employee.</p>
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

export default See_Feedback;
