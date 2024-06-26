import React, { useState } from "react";

const DatePick = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateInput, setDateInput] = useState("");

  const addDate = () => {
    if (dateInput && !selectedDates.includes(dateInput)) {
      setSelectedDates([...selectedDates, dateInput]);
    }
    setDateInput(""); // Reset date input
    console.log("hello");
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter((date) => date !== dateToRemove));
  };

  return (
    <div>
      <h2>Select Multiple Dates</h2>
      <input
        type="date"
        value={dateInput}
        onChange={(e) => setDateInput(e.target.value)}
      />
      <button onClick={addDate}>Add Date</button>
      <h3>Selected Dates:</h3>
      <ul>
        {selectedDates.map((date, index) => (
          <li key={index}>
            {date} <button onClick={() => removeDate(date)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Final Selected Dates (Array):</h3>
      <pre>{JSON.stringify(selectedDates, null, 2)}</pre>
    </div>
  );
};

export default DatePick;
