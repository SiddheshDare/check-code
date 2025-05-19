import React, { useState } from 'react';
import axios from 'axios';
import { addEmployee } from '../utils/httpsUtil';

const AddEmployeeForm = () => {
  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    Age: '',
    BusinessTravel: 'Non-Travel',
    DailyRate: '',
    Department: 'Research & Development',
    DistanceFromHome: '',
    Education: '1',
    EducationField: 'Life Sciences',
    EmployeeCount: '1',
    EnvironmentSatisfaction: '1',
    Gender: 'Male',
    HourlyRate: '',
    JobInvolvement: '1',
    JobLevel: '1',
    JobRole: 'Research Scientist',
    JobSatisfaction: '1',
    MaritalStatus: 'Single',
    MonthlyIncome: '',
    MonthlyRate: '',
    NumCompaniesWorked: '',
    Over18: 'Y',
    OverTime: 'No',
    PercentSalaryHike: '',
    PerformanceRating: '3',
    RelationshipSatisfaction: '1',
    StandardHours: '80',
    StockOptionLevel: '0',
    TotalWorkingYears: '',
    TrainingTimesLastYear: '0',
    WorkLifeBalance: '1',
    YearsAtCompany: '',
    YearsInCurrentRole: '',
    YearsSinceLastPromotion: '',
    YearsWithCurrManager: ''
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes with validation
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers or empty string
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submissionData = { ...formData };
      
      // Convert empty strings to null for number fields
      const numberFields = [
        'Age', 'DailyRate', 'DistanceFromHome', 'Education', 'EmployeeCount',
        'EnvironmentSatisfaction', 'HourlyRate', 'JobInvolvement', 'JobLevel',
        'JobSatisfaction', 'MonthlyIncome', 'MonthlyRate', 'NumCompaniesWorked',
        'PercentSalaryHike', 'PerformanceRating', 'RelationshipSatisfaction',
        'StandardHours', 'StockOptionLevel', 'TotalWorkingYears', 
        'TrainingTimesLastYear', 'WorkLifeBalance', 'YearsAtCompany',
        'YearsInCurrentRole', 'YearsSinceLastPromotion', 'YearsWithCurrManager'
      ];

      numberFields.forEach(field => {
        if (submissionData[field] === '') {
          submissionData[field] = null;
        } else {
          submissionData[field] = parseInt(submissionData[field], 10);
        }
      });

      // Submit to backend
      const response = await addEmployee(submissionData);

      // Check if response exists before accessing properties
      if (response && response.success) {
        setSuccess(true);
        setMessage(`Employee added successfully with number: ${response.employee_number || 'N/A'}`);
        // Reset form to initial state
        setFormData({
          Age: '',
          BusinessTravel: 'Non-Travel',
          DailyRate: '',
          Department: 'Research & Development',
          DistanceFromHome: '',
          Education: '1',
          EducationField: 'Life Sciences',
          EmployeeCount: '1',
          EnvironmentSatisfaction: '1',
          Gender: 'Male',
          HourlyRate: '',
          JobInvolvement: '1',
          JobLevel: '1',
          JobRole: 'Research Scientist',
          JobSatisfaction: '1',
          MaritalStatus: 'Single',
          MonthlyIncome: '',
          MonthlyRate: '',
          NumCompaniesWorked: '',
          Over18: 'Y',
          OverTime: 'No',
          PercentSalaryHike: '',
          PerformanceRating: '3',
          RelationshipSatisfaction: '1',
          StandardHours: '80',
          StockOptionLevel: '0',
          TotalWorkingYears: '',
          TrainingTimesLastYear: '0',
          WorkLifeBalance: '1',
          YearsAtCompany: '',
          YearsInCurrentRole: '',
          YearsSinceLastPromotion: '',
          YearsWithCurrManager: ''
        });
      } else {
        setSuccess(false);
        // Ensure we don't try to stringify undefined
        const errorMsg = response?.errors ? JSON.stringify(response.errors) : 'Unknown error occurred';
        setMessage(`Error: ${errorMsg}`);
      }
    } catch (error) {
      setSuccess(false);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field groups for better organization
  const fieldGroups = [
    {
      title: "Personal Information",
      fields: [
        { name: "Age", label: "Age", type: "number", required: true, min: 18, max: 65 },
        { name: "Gender", label: "Gender", type: "select", options: ["Male", "Female"], required: true },
        { name: "MaritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married", "Divorced"], required: true },
        { name: "DistanceFromHome", label: "Distance From Home (miles)", type: "number", required: true },
      ]
    },
    {
      title: "Job Information",
      fields: [
        { name: "Department", label: "Department", type: "select", options: ["Research & Development", "Sales", "Human Resources"], required: true },
        { name: "JobRole", label: "Job Role", type: "select", options: ["Research Scientist", "Laboratory Technician", "Sales Executive", "Manager"], required: true },
        { name: "JobLevel", label: "Job Level", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
        { name: "YearsAtCompany", label: "Years At Company", type: "number", required: true },
      ]
    },
    {
      title: "Compensation",
      fields: [
        { name: "DailyRate", label: "Daily Rate ($)", type: "number", required: true },
        { name: "HourlyRate", label: "Hourly Rate ($)", type: "number", required: true },
        { name: "MonthlyIncome", label: "Monthly Income ($)", type: "number", required: true },
        { name: "MonthlyRate", label: "Monthly Rate ($)", type: "number", required: true },
        { name: "PercentSalaryHike", label: "Percent Salary Hike", type: "number", required: true },
      ]
    },
    {
      title: "Employment Details",
      fields: [
        { name: "NumCompaniesWorked", label: "Number of Companies Worked", type: "number", required: true },
        { name: "TotalWorkingYears", label: "Total Working Years", type: "number", required: true },
        { name: "TrainingTimesLastYear", label: "Training Times Last Year", type: "number", required: true },
        { name: "YearsInCurrentRole", label: "Years In Current Role", type: "number", required: true },
        { name: "YearsSinceLastPromotion", label: "Years Since Last Promotion", type: "number", required: true },
        { name: "YearsWithCurrManager", label: "Years With Current Manager", type: "number", required: true },
      ]
    },
    {
      title: "Survey Ratings (1-5)",
      fields: [
        { name: "EnvironmentSatisfaction", label: "Environment Satisfaction", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
        { name: "JobSatisfaction", label: "Job Satisfaction", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
        { name: "RelationshipSatisfaction", label: "Relationship Satisfaction", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
        { name: "WorkLifeBalance", label: "Work Life Balance", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
        { name: "JobInvolvement", label: "Job Involvement", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
        { name: "PerformanceRating", label: "Performance Rating", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
      ]
    },
    {
      title: "Other Information",
      fields: [
        { name: "BusinessTravel", label: "Business Travel", type: "select", options: ["Non-Travel", "Travel_Rarely", "Travel_Frequently"], required: true },
        { name: "Education", label: "Education Level", type: "select", options: ["1", "2", "3", "4", "5"], required: true },
        { name: "EducationField", label: "Education Field", type: "select", options: ["Life Sciences", "Medical", "Marketing", "Technical Degree", "Other"], required: true },
        { name: "StockOptionLevel", label: "Stock Option Level", type: "select", options: ["0", "1", "2", "3"], required: true },
        { name: "OverTime", label: "Over Time", type: "select", options: ["No", "Yes"], required: true },
        { name: "Over18", label: "Over 18", type: "select", options: ["Y", "N"], required: true },
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {fieldGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required={field.required}
                    >
                      {field.options.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={field.type === 'number' ? handleNumberChange : handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required={field.required}
                      min={field.min}
                      max={field.max}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isSubmitting ? 'Submitting...' : 'Add Employee'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-md ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddEmployeeForm;