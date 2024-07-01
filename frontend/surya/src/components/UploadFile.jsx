import React, { useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function UploadFile() {
  const [file, setFile] = useState(null);

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
            "http://localhost:8800/upload",
            data,
            {
              withCredentials: true,
              maxContentLength: 10000000,
              maxBodyLength: 10000000,
            }
          );
          console.log(response.data);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
        console.log(data);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileDownload = async () => {
    let jsonData = [];
    try {
      let res = await axios.get("http://localhost:8800/alldata", {
        withCredentials: true,
      });
      jsonData = res.data;
      console.log(jsonData);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Add headers
      const headers = Object.keys(jsonData[0]);
      worksheet.addRow(headers);

      // Add rows
      jsonData.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // Save the file
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "data.xlsx");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      <br />
      <br />
      <button onClick={() => handleFileDownload()}>Download</button>
    </div>
  );
}
