import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Employee.css";
import EmpSidebar from "./EmpSidebar";
// import TaskBar from "./TaskBar";

export default function Employee() {
  const [user, setUser] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [review, setReview] = useState({});
  const [val, setVal] = useState({});
  const [style, setStyle] = useState({ disply: "none" });
  const [custItems, setCustItems] = useState({});
  const [displaySet, setDisplaySet] = useState(null);
  const [Key, setKey] = useState("");
  const [phone, setPhone] = useState("");
  const [flag, setFlag] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/session", {
          withCredentials: true,
        });

        const userID = res?.data.userId;
        setUser(userID);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSessionData();
  }, []);

  // Fetch employee data when user is set
  useEffect(() => {
    const fetchEmployeeData = async () => {
      console.log(user);
      if (user) {
        try {
          const url = `http://localhost:8800/emp`;
          const params = { empid: user };
          const res1 = await axios.get(url, { params, withCredentials: true });
          const newData = res1.data;
          setReview({ ...review, empid: user });

          // Process the data immediately
          // let cust = newData.map((item) => item.bpName);
          // let updatedCust = [];
          // cust.forEach((name, index) => {
          //   updatedCust[index] = updatedCust.includes(name) ? "" : name;
          // });

          // const updatedDisplayData = newData.map((rec, index) => ({
          //   ...rec,
          //   bpName: updatedCust[index],
          // }));

          //   setData(newData);
          setDisplayData(newData);
          newData.length === 0
            ? setStyle({ display: "block" })
            : setStyle({ display: "none" });

          // Update review object based on displayData
          let updatedReview = {};
          let temp = {};
          newData.forEach((rec) => {
            updatedReview[rec.ItemName] = {
              review: rec.review,
              description: rec.description,
            };
            temp[rec.bpcode] = [];
          });
          newData.map((rec) => {
            temp[rec.bpcode].push(rec);
          });
          setCustItems(temp);
          setReview((prevReview) => ({
            ...prevReview,
            ...updatedReview,
          }));
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchEmployeeData();
  }, [user]);

  const Logout = async () => {
    try {
      await axios.post(
        "http://localhost:8800/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const Send = async () => {
    let flag = true;
    console.log(review);
    // Object.keys(review).map((item) => {
    //   if (review[item].review === "" || review[item].description === "") {
    //     alert("Set all values before sending");
    //     flag = false;
    //     return;
    //   }
    // });
    Object.keys(custItems).map((item) => {
      custItems[item].map((rec) => {
        if (rec["review"] === "" || rec["description"] === "") {
          alert("Set all values before sending");
          flag = false;
          return;
        }
      });
    });
    console.log(flag);
    if (flag) {
      try {
        console.log(review);
        await axios.post(
          "http://localhost:8800/setreview",
          { empid: user, data: custItems },
          {
            withCredentials: true,
          }
        );
        console.log("review sent");
      } catch (err) {
        console.log(err);
      }
      console.log(val);
    }
  };

  const handleChange = (e, bpcode) => {
    const { name, value } = e.target;
    setVal({ ...val, [name]: value });
    // setReview({ ...review, [name]: { description: value } });
    let newCustItems = custItems;
    newCustItems[bpcode].map((rec) => {
      if (rec["ItemName"] === name) {
        rec["description"] = value;
      }
    });
    setCustItems(newCustItems);
  };

  const handleReview = (e, bpcode) => {
    const { name, value } = e.target;
    let newCustItems = custItems;
    newCustItems[bpcode].map((rec) => {
      if (rec["ItemName"] === name) {
        rec["review"] = value;
      }
    });
    setCustItems(newCustItems);
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
      {/* <TaskBar /> */}
      <div
        style={{
          display: "flex",
        }}
      >
        <EmpSidebar empName={user} />
        <button onClick={Logout}>Logout</button>
        <div className="Employee-canvas">
          {/* Hello Employee */}
          {console.log(displayData)}
          {console.log(review)}
          {console.log(custItems)}
          <div></div>
          <div>
            <div className="check">
              <div style={style}>No Records to be Shown</div>
              {/* {displayData.map((rec) => ( */}
              {Object.keys(custItems).map((rec, index) =>
                custItems[rec].length < 2 ? (
                  <div key={index} className="rec">
                    <h2>{custItems[rec][0].bpName}</h2>
                    <p>
                      <b>Phone:</b>

                      <a href={`tel:${custItems[rec][0]["Mobile Phone"]}`}>
                        {" "}
                        {custItems[rec][0]["Mobile Phone"]}
                      </a>
                    </p>
                    <p>
                      <b>Item Name:</b> {custItems[rec][0].ItemName}
                    </p>
                    <p>
                      <b>Brand:</b> {custItems[rec][0].Brand}
                    </p>
                    <p>
                      <b>Category: </b> {custItems[rec][0].Category}
                    </p>
                    <p>
                      <b>Item Total: </b> {custItems[rec][0].ItemTotal}
                    </p>
                    <p>
                      <b>Description:</b>
                    </p>
                    <textarea
                      name={custItems[rec][0].ItemName}
                      // value={review[custItems[rec][0].ItemName]["description"]}
                      value={custItems[rec][0].description}
                      onChange={(e) => handleChange(e, rec)}
                      placeholder="Additional Review"
                    />
                    <p>
                      <b>Reviews:</b>
                    </p>
                    {console.log(custItems[rec][0].ItemName)}
                    <div className="review-options">
                      {/* <input
                type="text"
                name={rec.bpcode}
                value={review[rec.bpcode]["description"]}
                onChange={(e) => handleChange(e)}
                /> */}
                      <input
                        type="radio"
                        name={custItems[rec][0].ItemName}
                        id="1"
                        value={"Ok"}
                        // checked={
                        //   review[custItems[rec][0].ItemName]["review"] === "Ok"
                        // }
                        defaultChecked={custItems[rec][0].review === "Ok"}
                        onChange={(e) =>
                          // setReview({
                          //   ...review,
                          //   [e.target.name]: {
                          //     review: e.target.value,
                          //     description: val[custItems[rec][0].ItemName],
                          //   },
                          // })
                          handleReview(e, custItems[rec][0].bpcode)
                        }
                      />
                      Ok
                      <input
                        type="radio"
                        name={custItems[rec][0].ItemName}
                        id="2"
                        value={"Not Ok"}
                        // checked={
                        //   review[custItems[rec][0].ItemName]["review"] ===
                        //   "Not Ok"
                        // }
                        defaultChecked={custItems[rec][0].review === "Not Ok"}
                        onChange={(e) =>
                          // setReview({
                          //   ...review,
                          //   [e.target.name]: {
                          //     review: e.target.value,
                          //     description: val[custItems[rec][0].ItemName],
                          //   },
                          // })
                          handleReview(e, custItems[rec][0].bpcode)
                        }
                      />
                      Not Ok
                      <input
                        type="radio"
                        name={custItems[rec][0].ItemName}
                        id="3"
                        value={"Not pick call"}
                        // checked={
                        //   review[custItems[rec][0].ItemName]["review"] ===
                        //   "Not pick call"
                        // }
                        defaultChecked={
                          custItems[rec][0].review === "Not pick call"
                        }
                        onChange={(e) =>
                          // setReview({
                          //   ...review,
                          //   [e.target.name]: {
                          //     review: e.target.value,
                          //     description: val[custItems[rec][0].ItemName],
                          //   },
                          // })
                          handleReview(e, custItems[rec][0].bpcode)
                        }
                      />
                      Not pick call
                    </div>
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
                      {console.log(displaySet)}
                      {/* {custItems[rec].map((obj) => {
                      console.log(Key);
                      if (Key === obj.ItemName) {
                        console.log("ok");
                        setDisplaySet(obj);
                        }
                        })} */}
                      {console.log(displaySet)}
                      {/* {displaySet ? (
                      <div>{displaySet.ItemName}
                      
                      </div>
                    ) : (
                      <div>hello</div>
                    )} */}

                      {displaySet && (
                        // <>
                        //   <p>
                        //     <b>Brand:</b> {displaySet.Brand}
                        //   </p>
                        //   <p>
                        //     <b>Category: </b> {displaySet.Category}
                        //   </p>
                        //   <p>
                        //     <b>Item Total: </b> {displaySet.ItemTotal}
                        //   </p>
                        //   <p>
                        //     <p>
                        //       <b>Description:</b>
                        //     </p>
                        //     <textarea
                        //       name={displaySet.ItemName}
                        //       onChange={(e) =>
                        //         handleChange(e, displaySet.bpcode)
                        //       }
                        //       placeholder="Additional Review"
                        //     />
                        //     <b>Reviews:</b>
                        //   </p>
                        //   <div className="review-options">
                        //     <input
                        //       type="radio"
                        //       name={displaySet.ItemName}
                        //       id="1"
                        //       value="Ok"
                        //       checked={
                        //         review[displaySet.ItemName]?.review === "Ok"
                        //       }
                        //       onChange={(e) =>
                        //         setReview({
                        //           ...review,
                        //           [e.target.name]: {
                        //             review: e.target.value,
                        //             description: val[displaySet.ItemName],
                        //           },
                        //         })
                        //       }
                        //     />
                        //     Ok
                        //     <input
                        //       type="radio"
                        //       name={displaySet.ItemName}
                        //       id="2"
                        //       value="Not Ok"
                        //       checked={
                        //         review[displaySet.ItemName]?.review === "Not Ok"
                        //       }
                        //       onChange={(e) =>
                        //         setReview({
                        //           ...review,
                        //           [e.target.name]: {
                        //             review: e.target.value,
                        //             description: val[displaySet.ItemName],
                        //           },
                        //         })
                        //       }
                        //     />
                        //     Not Ok
                        //     <input
                        //       type="radio"
                        //       name={displaySet.ItemName}
                        //       id="3"
                        //       value="Not pick call"
                        //       checked={
                        //         review[displaySet.ItemName]?.review ===
                        //         "Not pick call"
                        //       }
                        //       onChange={(e) =>
                        //         setReview({
                        //           ...review,
                        //           [e.target.name]: {
                        //             review: e.target.value,
                        //             description: val[displaySet.ItemName],
                        //           },
                        //         })
                        //       }
                        //     />
                        //     Not pick call
                        //   </div>
                        // </>

                        <>
                          {custItems[rec].map((item) =>
                            item.ItemName === Key ? (
                              <>
                                <p>{Key}</p>
                                <p>
                                  <b>Brand:</b> {item.Brand}
                                </p>
                                <p>
                                  <b>Category: </b> {item.Category}
                                </p>
                                <p>
                                  <b>Item Total: </b> {item.ItemTotal}
                                </p>
                                <p>
                                  <p>
                                    <b>Description:</b>
                                  </p>
                                  <textarea
                                    name={item.ItemName}
                                    value={item.description}
                                    onChange={(e) =>
                                      handleChange(e, item.bpcode)
                                    }
                                    placeholder="Additional Review"
                                  />
                                  <b>Reviews:</b>
                                </p>
                                <div className="review-options">
                                  <p>{item.review}</p>
                                  <input
                                    type="radio"
                                    name={item.ItemName}
                                    id="1"
                                    value="Ok"
                                    // checked={item.review === "Ok"}
                                    defaultChecked={item.review === "Ok"}
                                    onChange={(e) =>
                                      // setReview({
                                      //   ...review,
                                      //   [e.target.name]: {
                                      //     review: e.target.value,
                                      //     description: val[item.ItemName],
                                      //   },
                                      // })
                                      handleReview(e, item.bpcode)
                                    }
                                  />
                                  Ok
                                  <input
                                    type="radio"
                                    name={item.ItemName}
                                    id="2"
                                    value="Not Ok"
                                    // checked={item.review === "Not Ok"}
                                    defaultChecked={item.review === "Not Ok"}
                                    onChange={(e) =>
                                      // setReview({
                                      //   ...review,
                                      //   [e.target.name]: {
                                      //     review: e.target.value,
                                      //     description: val[item.ItemName],
                                      //   },
                                      // })
                                      handleReview(e, item.bpcode)
                                    }
                                  />
                                  Not Ok
                                  <input
                                    type="radio"
                                    name={item.ItemName}
                                    id="3"
                                    value="Not pick call"
                                    // checked={item.review === "Not pick call"}
                                    defaultChecked={
                                      item.review === "Not pick call"
                                    }
                                    onChange={(e) =>
                                      // setReview({
                                      //   ...review,
                                      //   [e.target.name]: {
                                      //     review: e.target.value,
                                      //     description: val[item.ItemName],
                                      //   },
                                      // })
                                      handleReview(e, item.bpcode)
                                    }
                                  />
                                  Not pick call
                                </div>
                              </>
                            ) : (
                              ""
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
            <button onClick={() => Send()} className="button">
              send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
