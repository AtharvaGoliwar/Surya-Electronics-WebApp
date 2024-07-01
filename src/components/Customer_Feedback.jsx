import React, { useState } from 'react';
import './Customer_Feedback.css';
import Sidebar from './sidebar';
import data from "../data/data.json";

function Customer_Feedback() {
    const [dateInput, setDateInput] = useState('');
    const [datesData, setDatesData] = useState([]);

    const handleDateChange = (e) => {
        setDateInput(e.target.value);
    };

    const addDate = (e) => {
        e.preventDefault();
        if (!dateInput) {
          alert("Please enter a date before adding.");
          return;
      }
        const filtered = data.filter(item => item["Invoice Date"] === dateInput);
        setDatesData([...datesData, { date: dateInput, data: filtered }]);
        setDateInput('');
    };

    const deleteDate = (index) => {
        const updatedDates = datesData.filter((_, i) => i !== index);
        setDatesData(updatedDates);
    };

    const handleSend = () => {
        
        const allData = datesData.flatMap(dateEntry => dateEntry.data);
        console.log('Sending data:', allData);
        
    };

    return (
        <>
            <div style={{display:"flex" , marginLeft:200}}>
                <Sidebar />
                <div>

                <div className='user-management-container'>
                    <main className="main-content" >
                        <header></header>
                        <section className="form-section">
                            <h3 style={{ color: 'black', textAlign: 'center' }}>Send Data</h3>
                            <form id="add-user-form">
                                <input
                                    type="date"
                                    value={dateInput}
                                    onChange={handleDateChange}
                                    required
                                    className="date-picker"
                                    style={{
                                        backgroundColor: '#333',
                                        color: '#fff',
                                        border: '1px solid #000',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        fontSize: '16px'
                                    }}
                                />
                                <button className='btn' onClick={addDate}>Add Date</button>
                            </form>
                            <div className="results">
                                {datesData.map((dateEntry, index) => (
                                    <div key={index} className="date-entry">
                                        <div className="date-header">
                                            <h4>Date: {dateEntry.date}</h4>
                                            <button onClick={() => deleteDate(index)}>Delete</button>
                                        </div>
                                        {dateEntry.data.length > 0 ? (
                                            dateEntry.data.map((item, i) => (
                                                <div key={i} className="result-item">
                                                    <p>Sales Employee: {item.salesEmp}</p>
                                                    <p>Branch: {item.Branch}</p>
                                                    <p>BP Code: {item.bpcode}</p>
                                                    <p>Brand: {item.Brand}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className='result-item'>No data available for this date.</p>
                                        )}
                                    </div>
                                ))}
                                {datesData.length > 0 && (
                                <button className='btn' onClick={handleSend}>Send Data</button>
                            )}
                            </div>
                            
                        </section>
                    </main>
                </div>
                </div>
            </div>
        </>
    );
}

export default Customer_Feedback;
