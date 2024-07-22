import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";

import Sidebar from "./components/sidebar";
import StaffRegistrationForm from "./components/Add_Staff";
import StaffDeletionForm from "./components/Delete_Staff";
import Customer_Feedback from "./components/Customer_Feedback";
import See_Feedback from "./components/See_Feedback";
import Employee_Profiles from "./components/Employee_Profiles";
import Logout from "./components/Logout";
import Home from "./components/home";
import data from "./data/data.json";
import Login from "./components/Login";
import Employee from "./components/Employee";
import ExtraData from "./components/ExtraData";
import ChangePassword from "./components/ChangePassword";
import Track_Claims from "./components/Track_Claims";
import Incentive_Tracker from "./components/Incentive_Tracker";
import SuperAdmin from "./components/SuperAdmin";
import SuperEmpProfiles from "./components/Super_EmpProfiles";
function App() {
  const [count, setCount] = useState(0);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // useEffect(() => {
  //     // Log a specific row of data (e.g., the first row)
  //     const rowIndex = 0; // Change this index to log different rows
  //     console.log(data[rowIndex]);
  // }, []);

  return (
    <>
      {/* <Sidebar/> */}
      <BrowserRouter>
        {/* <StaffRegistrationForm/> */}
        {/* <StaffDeletionForm/> */}
        {/* <Customer_Feedback /> */}

        <Routes>
          <Route path="/admin" element={<Home />}></Route>
          <Route path="/Add_Staff" element={<StaffRegistrationForm />}></Route>
          <Route
            path="/Delete_Staff"
            element={<StaffDeletionForm></StaffDeletionForm>}
          ></Route>
          <Route
            path="/Customer_Feedback"
            element={<Customer_Feedback></Customer_Feedback>}
          ></Route>
          <Route
            path="/See_Feedback"
            element={<See_Feedback></See_Feedback>}
          ></Route>
          <Route
            path="/Employee_Profiles"
            element={<Employee_Profiles></Employee_Profiles>}
          ></Route>
          <Route path="/Logout" element={<Logout></Logout>}></Route>
          <Route path="/" element={<Login />} />
          <Route path="/emp" element={<Employee />} />
          <Route path="/delemp" element={<ExtraData />} />
          <Route path="/Change_Password" element={<ChangePassword />} />
          <Route path="/Track_Claims" element={<Track_Claims />} />
          <Route path="/Incentive_Tracker" element={<Incentive_Tracker />} />
          <Route path="/SuperAdmin" element={<SuperAdmin />} />
          <Route path="/SuperEmpProfiles" element={<SuperEmpProfiles />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
