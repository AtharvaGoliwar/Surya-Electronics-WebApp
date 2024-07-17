import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Incentive_Tracker.css";
import EmpSidebar from "./EmpSidebar";

export default function Incentive_Tracker() {
  const [user, setUser] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [formData, setFormData] = useState({});
  const [val, setVal] = useState({});
  const [style, setStyle] = useState({ disply: "none" });
  const [custItems, setCustItems] = useState({});
  const [displaySet, setDisplaySet] = useState(null);
  const [Key, setKey] = useState("");
  const [flag, setFlag] = useState(true);

  const [incentiveData, setIncentiveData] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${url}/session`, {
          withCredentials: true,
        });
        setUser(res.data.userId);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  // Fetch incentive data when user is set
  useEffect(() => {
    const fetchIncentiveData = async () => {
      if (user) {
        try {
          const res1 = await axios.get(`${url}/incentiveAllData`, {
            withCredentials: true,
          });
          const newData = res1.data;
          let newUpdatedData = [];
          for (let i = 0; i < newData.length; i++) {
            if (newData[i]["salesEmp"] === user) {
              newUpdatedData.push(newData[i]);
            }
          }
          //   setFormData({ ...formData, empid: user });
          setIncentiveData(newUpdatedData);
          //   setDisplayData(newData);
          newData.length === 0
            ? setStyle({ display: "block" })
            : setStyle({ display: "none" });

          let updatedFormData = {};
          let temp = {};
          newData.forEach((rec) => {
            updatedFormData[rec.ItemName] = {
              docDate: rec.docDate,
              ItemCode: rec.ItemCode,
              ItemName: rec.ItemName,
              ItemGroup: rec.ItemGroup,
              Quantity: rec.Quantity,
              ItemTotal: rec.ItemTotal,
            };
            temp[rec.bpcode] = [];
          });
          // newData.map((rec) => {
          //   temp[rec.bpcode].push(rec);
          // });
          // setCustItems(temp);
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...updatedFormData,
          }));
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchIncentiveData();
  }, [user]);

  const Send = async () => {
    let flag = true;
    console.log(formData);
    Object.keys(formData).map((item) => {
      if (
        formData[item].SNLC === "" ||
        formData[item].SELLING_PRICE === "" ||
        formData[item].SNLC_ONLINE_EW === "" ||
        formData[item].INCENTIVE_TYPE === "" ||
        formData[item].SRP_QTY === "" ||
        formData[item].REMARK === ""
      ) {
        alert("Set all values before sending");
        flag = false;
        return;
      }
    });
    if (flag) {
      let sendData = [];
      Object.keys(formData).map((item) => {
        sendData.push(item);
      });
      try {
        // await axios.post("http://localhost:8800/setIncentive", formData, {
        await axios.post(`${url}/setIncentive`, sendData, {
          withCredentials: true,
        });
        console.log("Incentive data sent");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVal({ ...val, [name]: value });
    setFormData({ ...formData, [name]: { ...formData[name], [name]: value } });
  };

  const handleSelectChange = (e, bpcode) => {
    const selectedKey = e.target.value;
    setKey(selectedKey);
    let selectedItem = null;
    custItems[bpcode].map((rec) => {
      if (rec.ItemName === selectedKey) {
        selectedItem = rec;
      }
    });
    setDisplaySet(selectedItem);
  };

  return (
    <>
      {console.log(formData)}
      {console.log(incentiveData)}
      <div
        style={{
          display: "flex",
        }}
      >
        <EmpSidebar empName={user} />
        <div className="Incentive-canvas">
          {incentiveData.length === 0 && (
            <div style={style}>No Records to be Shown</div>
          )}
          <div className="check">
            {Object.keys(formData).map((rec, index) =>
              formData[rec].length < 2 ? (
                <div key={index} className="rec">
                  <h2>{formData[rec].bpName}</h2>
                  {/* <p>
                    <b>Phone:</b>
                    <a href={`tel:${formData[rec]["Mobile Phone"]}`}>
                      {custItems[rec][0]["Mobile Phone"]}
                    </a>
                  </p> */}
                  <p>
                    <b>Item Name:</b> {formData[rec].ItemName}
                  </p>
                  <p>
                    <b>Item Group:</b> {custItems[rec][0].ItemGroup}
                  </p>
                  <p>
                    <b>Quantity:</b> {custItems[rec][0].Quantity}
                  </p>
                  <p>
                    <b>Item Total:</b> {custItems[rec][0].ItemTotal}
                  </p>
                  <p>
                    <b>SNLC:</b>
                    <input
                      name={custItems[rec][0].ItemName}
                      value={formData[custItems[rec][0].ItemName]?.SNLC || ""}
                      onChange={handleChange}
                      placeholder="SNLC"
                    />
                  </p>
                  <p>
                    <b>SELLING PRICES:</b>
                    <input
                      name={custItems[rec][0].ItemName}
                      value={
                        formData[custItems[rec][0].ItemName]?.SELLING_PRICES ||
                        ""
                      }
                      onChange={handleChange}
                      placeholder="SELLING PRICES"
                    />
                  </p>
                  <p>
                    <b>SNLC/ONLINE/EW:</b>
                    <input
                      name={custItems[rec][0].ItemName}
                      value={
                        formData[custItems[rec][0].ItemName]?.SNLC_ONLINE_EW ||
                        ""
                      }
                      onChange={handleChange}
                      placeholder="SNLC/ONLINE/EW"
                    />
                  </p>
                  <p>
                    <b>INCENTIVE TYPE:</b>
                    <input
                      name={custItems[rec][0].ItemName}
                      value={
                        formData[custItems[rec][0].ItemName]?.INCENTIVE_TYPE ||
                        ""
                      }
                      onChange={handleChange}
                      placeholder="INCENTIVE TYPE"
                    />
                  </p>
                  <p>
                    <b>SRP QTY:</b>
                    <input
                      name={custItems[rec][0].ItemName}
                      value={
                        formData[custItems[rec][0].ItemName]?.SRP_QTY || ""
                      }
                      onChange={handleChange}
                      placeholder="SRP QTY"
                    />
                  </p>
                  <p>
                    <b>SRP TOTAL:</b>
                    <input
                      name={custItems[rec][0].ItemName}
                      value={
                        formData[custItems[rec][0].ItemName]?.SRP_TOTAL || ""
                      }
                      onChange={handleChange}
                      placeholder="SRP TOTAL"
                    />
                  </p>
                  <p>
                    <b>REMARK:</b>
                    <textarea
                      name={custItems[rec][0].ItemName}
                      value={formData[custItems[rec][0].ItemName]?.REMARK || ""}
                      onChange={handleChange}
                      placeholder="REMARK"
                    />
                  </p>
                </div>
              ) : (
                <div key={index} className="rec">
                  <h2>{custItems[rec][0].bpName}</h2>
                  <p>
                    <b>Phone:</b>
                    <a href={`tel:${custItems[rec][0]["Mobile Phone"]}`}>
                      {custItems[rec][0]["Mobile Phone"]}
                    </a>
                  </p>
                  <div>
                    <b>Item Name:</b>
                    <select
                      name=""
                      onChange={(e) => handleSelectChange(e, rec)}
                    >
                      <option value="" disabled selected>
                        Select Item Name
                      </option>
                      {custItems[rec].map((item) => (
                        <option value={item.ItemName}>{item.ItemName}</option>
                      ))}
                    </select>
                    {displaySet && (
                      <>
                        <p>
                          <b>Item Group:</b> {displaySet.ItemGroup}
                        </p>
                        <p>
                          <b>Quantity:</b> {displaySet.Quantity}
                        </p>
                        <p>
                          <b>Item Total:</b> {displaySet.ItemTotal}
                        </p>
                        <p>
                          <b>SNLC:</b>
                          <input
                            name={displaySet.ItemName}
                            value={formData[displaySet.ItemName]?.SNLC || ""}
                            onChange={handleChange}
                            placeholder="SNLC"
                          />
                        </p>
                        <p>
                          <b>SELLING PRICES:</b>
                          <input
                            name={displaySet.ItemName}
                            value={
                              formData[displaySet.ItemName]?.SELLING_PRICES ||
                              ""
                            }
                            onChange={handleChange}
                            placeholder="SELLING PRICES"
                          />
                        </p>
                        <p>
                          <b>SNLC/ONLINE/EW:</b>
                          <input
                            name={displaySet.ItemName}
                            value={
                              formData[displaySet.ItemName]?.SNLC_ONLINE_EW ||
                              ""
                            }
                            onChange={handleChange}
                            placeholder="SNLC/ONLINE/EW"
                          />
                        </p>
                        <p>
                          <b>INCENTIVE TYPE:</b>
                          <input
                            name={displaySet.ItemName}
                            value={
                              formData[displaySet.ItemName]?.INCENTIVE_TYPE ||
                              ""
                            }
                            onChange={handleChange}
                            placeholder="INCENTIVE TYPE"
                          />
                        </p>
                        <p>
                          <b>SRP QTY:</b>
                          <input
                            name={displaySet.ItemName}
                            value={formData[displaySet.ItemName]?.SRP_QTY || ""}
                            onChange={handleChange}
                            placeholder="SRP QTY"
                          />
                        </p>
                        <p>
                          <b>REMARK:</b>
                          <textarea
                            name={displaySet.ItemName}
                            value={formData[displaySet.ItemName]?.REMARK || ""}
                            onChange={handleChange}
                            placeholder="REMARK"
                          />
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          <button onClick={() => Send()} className="button">
            Send
          </button>
        </div>
      </div>
    </>
  );
}
