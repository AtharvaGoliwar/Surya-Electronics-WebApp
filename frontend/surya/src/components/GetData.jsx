import { useState } from "react";
import React from "react";

export default function GetData() {
  const [Date, setDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setDate(date);

    // const filtered = data.filter((item) => item["Invoice Date"] === date);
    // setFilteredData(filtered);
  };
  return (
    <>
      <div>
        Here is the data
        <input
          type="date"
          value={Date}
          onChange={handleDateChange}
          required
          className="date-picker"
          style={{
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #000",
            borderRadius: "4px",
            padding: "10px",
            fontSize: "16px",
          }}
        />
        {console.log(Date)}
      </div>
    </>
  );
}
