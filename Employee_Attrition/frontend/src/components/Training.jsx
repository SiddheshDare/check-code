import React, { useState, useEffect } from "react";
import { trainModel, getAvailableModels } from "../utils/httpsUtil";

function Training() {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [modelParams, setModelParams] = useState({
    n_estimators: 1000,
    max_depth: 4,
    min_samples_leaf: 2
  });
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Sample feature options - you should populate this based on your actual features
  const featureOptions = [
    'Age', 'DailyRate', 'DistanceFromHome', 'Education', 'EnvironmentSatisfaction',
    'JobInvolvement', 'JobLevel', 'JobSatisfaction', 'MonthlyIncome', 'NumCompaniesWorked',
    'PercentSalaryHike', 'PerformanceRating', 'RelationshipSatisfaction', 'StockOptionLevel',
    'TotalWorkingYears', 'TrainingTimesLastYear', 'WorkLifeBalance', 'YearsAtCompany',
    'YearsInCurrentRole', 'YearsSinceLastPromotion', 'YearsWithCurrManager',
    'BusinessTravel_Travel_Frequently', 'BusinessTravel_Travel_Rarely',
    'Department_Research & Development', 'Department_Sales',
    'EducationField_Life Sciences', 'EducationField_Marketing', 'EducationField_Medical',
    'EducationField_Other', 'EducationField_Technical Degree', 'Gender_Male',
    'JobRole_Human Resources', 'JobRole_Laboratory Technician', 'JobRole_Manager',
    'JobRole_Manufacturing Director', 'JobRole_Research Director',
    'JobRole_Research Scientist', 'JobRole_Sales Executive', 'JobRole_Sales Representative',
    'MaritalStatus_Married', 'MaritalStatus_Single', 'OverTime_Yes'
  ];

  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    try {
      const models = await getAvailableModels();
      setAvailableModels(models);
    } catch (error) {
      console.error("Error fetching available models:", error);
    }
  };

  const handleTraining = async () => {
    setResponse(null);
    setIsLoading(true);
    try {
      const data = await trainModel({
        model_params: modelParams,
        features: selectedFeatures
      });
      setResponse(data);
      // Refresh available models after training
      await fetchAvailableModels();
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setModelParams(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Model Training</h2>
      
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Model Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Estimators
            </label>
            <input
              type="number"
              name="n_estimators"
              value={modelParams.n_estimators}
              onChange={handleParamChange}
              className="w-full p-2 border rounded"
              min="10"
              max="2000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Depth
            </label>
            <input
              type="number"
              name="max_depth"
              value={modelParams.max_depth}
              onChange={handleParamChange}
              className="w-full p-2 border rounded"
              min="1"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Samples Leaf
            </label>
            <input
              type="number"
              name="min_samples_leaf"
              value={modelParams.min_samples_leaf}
              onChange={handleParamChange}
              className="w-full p-2 border rounded"
              min="1"
              max="10"
            />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Feature Selection</h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Select features to include in the model (leave empty to use all):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
            {featureOptions.map(feature => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleTraining}
          disabled={isLoading}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? "Training in progress..." : "Start Training"}
        </button>
      </div>
      
      {response && (
        <div className="w-full max-w-4xl bg-gray-100 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2">Training Results</h3>
          {response.error ? (
            <p className="text-red-500">{response.error}</p>
          ) : (
            <div>
              <p className="mb-2"><strong>Model ID:</strong> {response.model_id}</p>
              <p className="mb-2"><strong>Accuracy:</strong> {response.metrics?.accuracy?.toFixed(4)}</p>
              <p className="mb-2"><strong>Precision:</strong> {response.metrics?.precision?.toFixed(4)}</p>
              <p className="mb-2"><strong>Recall:</strong> {response.metrics?.recall?.toFixed(4)}</p>
              <p className="mb-2"><strong>F1 Score:</strong> {response.metrics?.f1_score?.toFixed(4)}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Available Models</h3>
        {availableModels.length === 0 ? (
          <p>No models available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableModels.map(model => (
                  <tr key={model.model_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{model.model_id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(model.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{model.metrics?.accuracy?.toFixed(4)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{model.features.length} features</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Training;