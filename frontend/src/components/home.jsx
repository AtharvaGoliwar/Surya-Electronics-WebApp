import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import axios from "axios";
import ExcelJS from "exceljs";
import { JsonToTable } from "react-json-to-table";

import "./home.css";

function Home() {
  const [isAdmin, setAdmin] = useState(false);
  const [file, setFile] = useState(null);
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const buffer = e.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        const headers = [];
        worksheet.getRow(1).eachCell((cell) => {
          headers.push(cell.value);
        });

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            const rowData = {};
            row.eachCell((cell, colNumber) => {
              rowData[headers[colNumber - 1]] = cell.value;
            });
            rows.push(rowData);
          }
        });

        let data = { headers, rows };
        for (let i = 0; i < data.rows.length; i++) {
          let dateObj = new Date(data.rows[i]["Invoice Date"]);
          data.rows[i]["Invoice Date"] = `${dateObj.getFullYear()}-${(
            dateObj.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${dateObj
            .getDate()
            .toString()
            .padStart(2, "0")}`;
        }

        try {
          const response = await axios.post(`${url}/uploadIncentive`, data, {
            withCredentials: true,
            maxContentLength: 10000000,
            maxBodyLength: 10000000,
          });
          console.log(response.data);
          alert("File Uploaded Successfully");
        } catch (error) {
          console.error("Error uploading file:", error);
        }
        console.log(data);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        let res = await axios(`${url}/admin`, {
          withCredentials: true,
        });
        console.log(res.data);
        let adminState = res.data.admin;
        setAdmin(adminState);
      } catch (err) {
        console.log(err);
      }
    };
    checkAdmin();
  }, []);

  if (!isAdmin) {
    return (
      <>
        <h1>Admin Authorized Data only!!!</h1>
      </>
    );
  }
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <div className="upload-section">
          <h2>Upload Incentive Excel File</h2>
          <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
          <div>
            <button onClick={() => handleFileUpload()}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
