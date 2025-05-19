import axios from "axios";

// Dynamically determine API base URL based on environment
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:8001';

// Training-related functions
export const trainModel = async (trainingConfig) => {
  try {
    const response = await axios.post(`${BASE_URL}/training/`, trainingConfig);
    return response.data;
  } catch (error) {
    console.error("Error during training:", error);
    throw new Error(error.response?.data?.response || "Training failed");
  }
};

export const getAvailableModels = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/models/`);
    return response.data.models || [];
  } catch (error) {
    console.error("Error fetching available models:", error);
    return [];
  }
};

// Prediction-related functions
export const predictAttrition = async (predictionRequest) => {
  try {
    const response = await axios.post(`${BASE_URL}/prediction/`, predictionRequest);
    return response.data.response;
  } catch (error) {
    console.error("Error during prediction:", error);
    throw new Error(error.response?.data?.error || "Prediction failed");
  }
};

export const getPrefilledPredictions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/prediction/prefilled-predictions/`);
    return response.data;
  } catch (error) {
    console.error("Error during fetching prediction data:", error);
    return null;
  }
};

export const getEmployeeDetails = async (employeeNumber) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/prediction/prefilled-predictions/${employeeNumber}/`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for employee ${employeeNumber}:`, error);
    throw new Error(error.response?.data?.error || "Failed to fetch employee details");
  }
};

// Utility function for getting model details
export const getModelDetails = async (modelId) => {
  try {
    const response = await axios.get(`${BASE_URL}/models/${modelId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for model ${modelId}:`, error);
    throw new Error(error.response?.data?.error || "Failed to fetch model details");
  }
};

export const predictData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/prediction/prefilled-predictions/`);
    return response.data;
  } catch (error) {
    console.error("Error during fetching prediction data:", error);
    return null;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${BASE_URL}/employees/add/`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw new Error(error.response?.data?.error || "Failed to add employee");
  }
};
