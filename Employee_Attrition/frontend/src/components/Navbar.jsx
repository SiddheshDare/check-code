import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";

function Navbar({isLoggedIn, setIsLoggedIn}) {
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white py-4 flex justify-between items-center px-6">
      { isLoggedIn?
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
        >
          Home
        </button>:""
      }

      <h1 className="text-2xl font-bold flex-1 text-center">
        Employee Attrition Prediction
      </h1>

      {isLoggedIn?<Logout setIsLoggedIn={setIsLoggedIn}/>:""}
    </nav>
  );
}

export default Navbar;
