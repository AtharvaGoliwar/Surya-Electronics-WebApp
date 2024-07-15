import React, { useState, useEffect } from "react";
import SuperSidebar from "./SuperSidebar";
import axios from "axios";
import ExcelJS from "exceljs";

import "./SuperAdmin.css";

function SuperAdmin() {
  const [isSuperAdmin, setSuperAdmin] = useState(false);
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
          const response = await axios.post(
            // "http://localhost:8800/upload",
            `${url}/upload`,
            data,
            {
              withCredentials: true,
              maxContentLength: 10000000,
              maxBodyLength: 10000000,
            }
          );
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
        // let res = await axios("http://localhost:8800/admin", {
        let res = await axios.get(`${url}/superadmin`, {
          withCredentials: true,
        });
        console.log(res.data);
        let adminState = res.data.superadmin;
        setSuperAdmin(adminState);
      } catch (err) {
        console.log(err);
      }
    };
    checkAdmin();
  }, []);

  if (!isSuperAdmin) {
    return (
      <>
        <h1>Super Admin Authorized Data only!!!</h1>
      </>
    );
  }
  return (
    <div className="home-container">
      <SuperSidebar />
      <div className="main-content">
        <div className="upload-section">
          <h2>Upload Excel File</h2>
          <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
          <div>
            <button onClick={() => handleFileUpload()}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdmin;
