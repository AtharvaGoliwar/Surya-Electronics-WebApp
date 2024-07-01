import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import CreateUser from "./components/CreateUser";
import Users from "./components/Users";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Employee from "./components/Employee";
import Employee1 from "./components/Employee1";
import ExtraData from "./components/ExtraData";
import DeleteUser from "./components/DeleteUser";
import UploadFile from "./components/UploadFile";

function App() {
  const [count, setCount] = useState(0);
  let empid = 0;
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addUser" element={<CreateUser />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/emp" element={<Employee />} />
            <Route path="/delemp" element={<ExtraData />} /> //This route is
            temporary and should be added under Admin panel
            <Route path="/deleteUser" element={<DeleteUser />} />
            <Route path="/upload" element={<UploadFile />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
