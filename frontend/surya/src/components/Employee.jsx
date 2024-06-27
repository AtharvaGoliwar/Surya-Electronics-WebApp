import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Employee1() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [review, setReview] = useState({});
  const [val, setVal] = useState({});

  const navigate = useNavigate();

  // Fetch session data on mount
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/session");
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
      if (user) {
        try {
          const url = `http://localhost:8800/emp`;
          const params = { empid: user };
          const res1 = await axios.get(url, { params });
          const newData = res1.data;
          setReview({ ...review, empid: user });

          // Process the data immediately
          let cust = newData.map((item) => item.bpName);
          let updatedCust = [];
          cust.forEach((name, index) => {
            updatedCust[index] = updatedCust.includes(name) ? "" : name;
          });

          const updatedDisplayData = newData.map((rec, index) => ({
            ...rec,
            bpName: updatedCust[index],
          }));

          setData(newData);
          setDisplayData(updatedDisplayData);

          // Update review object based on displayData
          const updatedReview = {};
          updatedDisplayData.forEach((rec) => {
            updatedReview[rec.bpcode] = {
              review: rec.review,
              description: rec.description,
            };
          });
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
      await axios.post("http://localhost:8800/logout", {});
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const Send = async () => {
    try {
      console.log(review);
      await axios.post("http://localhost:8800/setreview", review);
      console.log("review sent");
    } catch (err) {
      console.log(err);
    }
    console.log(val);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVal({ ...val, [name]: value });
    setReview({ ...review, [name]: { description: value } });
  };
  return (
    <div>
      Hello Employee
      <button onClick={Logout}>Logout</button>
      {console.log(displayData)}
      {console.log(review)}
      <div>
        {displayData.map((rec) => (
          <div key={rec.id}>
            {rec.salesEmp}, {rec.bpName}, {rec.ItemName}, ,{" "}
            {rec["Mobile Phone"]}, {rec.ItemTotal}
            <br />
            <br />
            <div>
              <input
                type="text"
                name={rec.bpcode}
                value={review[rec.bpcode]["description"]}
                onChange={(e) => handleChange(e)}
              />
              <input
                type="radio"
                name={rec.bpcode}
                id="1"
                value={"Ok"}
                checked={review[rec.bpcode]["review"] === "Ok"}
                onChange={(e) =>
                  setReview({
                    ...review,
                    [e.target.name]: {
                      review: e.target.value,
                      description: val[rec.bpcode],
                    },
                  })
                }
              />
              Ok
              <input
                type="radio"
                name={rec.bpcode}
                id="2"
                value={"Not Ok"}
                checked={review[rec.bpcode]["review"] === "Not Ok"}
                onChange={(e) =>
                  setReview({
                    ...review,
                    [e.target.name]: {
                      review: e.target.value,
                      description: val[rec.bpcode],
                    },
                  })
                }
              />
              Not Ok
              <input
                type="radio"
                name={rec.bpcode}
                id="3"
                value={"Not pick call"}
                checked={review[rec.bpcode]["review"] === "Not pick call"}
                onChange={(e) =>
                  setReview({
                    ...review,
                    [e.target.name]: {
                      review: e.target.value,
                      description: val[rec.bpcode],
                    },
                  })
                }
              />
              Not pick call
            </div>
          </div>
        ))}
        <button onClick={() => Send()}>send</button>
      </div>
    </div>
  );
}
