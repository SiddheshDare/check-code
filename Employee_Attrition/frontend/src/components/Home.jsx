import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Employee Attrition Prediction System
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        This system helps in predicting employee attrition based on various factors.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/training")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          Train Model
        </button>
        <button
          onClick={() => navigate("/prediction")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Add Employee (Prediction Purpose)
        </button>
        <button
          onClick={() => navigate("/prediction/prefilled-predictions")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Predict
        </button>
      </div>
    </div>
  );
}

export default Home;