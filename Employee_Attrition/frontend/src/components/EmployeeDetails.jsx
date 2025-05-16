import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeDetails, predictAttrition, getAvailableModels } from "../utils/httpsUtil";

const EmployeeDetails = () => {
    const { employeeNumber } = useParams();
    const [details, setDetails] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [availableModels, setAvailableModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeeData, models] = await Promise.all([
                    getEmployeeDetails(employeeNumber),
                    getAvailableModels()
                ]);
                setDetails(employeeData);
                setAvailableModels(models);
                if (models.length > 0) {
                    setSelectedModel(models[0].model_id);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [employeeNumber]);

    const handlePrediction = async () => {
        if (!selectedModel) return;
        
        setIsLoading(true);
        setPredictionResult(null);
        try {
            const result = await predictAttrition({
                model_id: selectedModel,
                data: details
            });
            setPredictionResult(result);
        } catch (error) {
            setPredictionResult({ error: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    if (!details) return <p className="p-6 text-center">Loading employee details...</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Employee #{employeeNumber}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Personal Details</h3>
                            <p><strong>Age:</strong> {details.Age}</p>
                            <p><strong>Gender:</strong> {details.Gender}</p>
                            <p><strong>Marital Status:</strong> {details.MaritalStatus}</p>
                            <p><strong>Distance From Home:</strong> {details.DistanceFromHome}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-2">Job Details</h3>
                            <p><strong>Department:</strong> {details.Department}</p>
                            <p><strong>Job Role:</strong> {details.JobRole}</p>
                            <p><strong>Job Level:</strong> {details.JobLevel}</p>
                            <p><strong>Years At Company:</strong> {details.YearsAtCompany}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-2">Compensation</h3>
                            <p><strong>Monthly Income:</strong> ${details.MonthlyIncome?.toLocaleString()}</p>
                            <p><strong>Daily Rate:</strong> ${details.DailyRate}</p>
                            <p><strong>Hourly Rate:</strong> ${details.HourlyRate}</p>
                            <p><strong>Percent Salary Hike:</strong> {details.PercentSalaryHike}%</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-2">Satisfaction</h3>
                            <p><strong>Job Satisfaction:</strong> {details.JobSatisfaction}/4</p>
                            <p><strong>Environment Satisfaction:</strong> {details.EnvironmentSatisfaction}/4</p>
                            <p><strong>Relationship Satisfaction:</strong> {details.RelationshipSatisfaction}/4</p>
                            <p><strong>Work Life Balance:</strong> {details.WorkLifeBalance}/4</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Attrition Prediction</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Model
                        </label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full p-2 border rounded"
                            disabled={isLoading}
                        >
                            {availableModels.map(model => (
                                <option key={model.model_id} value={model.model_id}>
                                    Model ({new Date(model.timestamp).toLocaleDateString()}) - Acc: {(model.metrics?.accuracy * 100).toFixed(1)}%
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        onClick={handlePrediction}
                        disabled={isLoading || !selectedModel}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition mb-4"
                    >
                        {isLoading ? "Predicting..." : "Predict Attrition"}
                    </button>
                    
                    {predictionResult && (
                        <div className="p-4 border rounded-lg bg-gray-50">
                            {predictionResult.error ? (
                                <p className="text-red-500">{predictionResult.error}</p>
                            ) : (
                                <>
                                    <h3 className="font-bold text-lg mb-2">Prediction Result</h3>
                                    <p className="text-lg mb-1">
                                        <strong>Attrition Risk:</strong> {predictionResult.prediction}
                                    </p>
                                    <p className="text-lg mb-1">
                                        <strong>Probability:</strong> {(predictionResult.probability * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-lg">
                                        <strong>Confidence:</strong> {predictionResult.confidence}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Model ID: {predictionResult.model_id}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;