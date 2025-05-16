import React , {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Training from "./components/Training";
import AddEmployee from "./components/AddEmployee";
import Login from "./components/Login";
import PredictionData from "./components/PredictionData";
import EmployeeDetails from "./components/EmployeeDetails";

function App() {
  const[isLoggedIn,setIsLoggedIn]=useState(false);
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Routes>
        <Route path="/" element={isLoggedIn?<Home /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/training" element={<Training />} />
        <Route path="/prediction" element={<AddEmployee />} />
        <Route path="/prediction/prefilled-predictions" element={<PredictionData />} />
        <Route path="/prediction/prefilled-predictions/:employeeNumber" element={<EmployeeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;