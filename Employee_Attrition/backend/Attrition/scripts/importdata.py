import pandas as pd
from Attrition.models import EmployeeData

def run():
    csv_file_path = '/app/Employee_Attrition_Prediction.csv'
    df = pd.read_csv(csv_file_path)

    for index, row in df.iterrows():
        attrition_str = str(row['Attrition']).strip().lower()
        attrition_bool = True if attrition_str in ['yes', 'true', '1'] else False

        employee, created = EmployeeData.objects.update_or_create(
            EmployeeNumber=row['EmployeeNumber'],
            defaults={
                'Age': row['Age'],
                'Attrition': attrition_bool,
                'BusinessTravel': row['BusinessTravel'],
                'DailyRate': row['DailyRate'],
                'Department': row['Department'],
                'DistanceFromHome': row['DistanceFromHome'],
                'Education': row['Education'],
                'EducationField': row['EducationField'],
                'EmployeeCount': row['EmployeeCount'],
                'EnvironmentSatisfaction': row['EnvironmentSatisfaction'],
                'Gender': row['Gender'],
                'HourlyRate': row['HourlyRate'],
                'JobInvolvement': row['JobInvolvement'],
                'JobLevel': row['JobLevel'],
                'JobRole': row['JobRole'],
                'JobSatisfaction': row['JobSatisfaction'],
                'MaritalStatus': row['MaritalStatus'],
                'MonthlyIncome': row['MonthlyIncome'],
                'MonthlyRate': row['MonthlyRate'],
                'NumCompaniesWorked': row['NumCompaniesWorked'],
                'Over18': row['Over18'],
                'OverTime': row['OverTime'],
                'PercentSalaryHike': row['PercentSalaryHike'],
                'PerformanceRating': row['PerformanceRating'],
                'RelationshipSatisfaction': row['RelationshipSatisfaction'],
                'StandardHours': row['StandardHours'],
                'StockOptionLevel': row['StockOptionLevel'],
                'TotalWorkingYears': row['TotalWorkingYears'],
                'TrainingTimesLastYear': row['TrainingTimesLastYear'],
                'WorkLifeBalance': row['WorkLifeBalance'],
                'YearsAtCompany': row['YearsAtCompany'],
                'YearsInCurrentRole': row['YearsInCurrentRole'],
                'YearsSinceLastPromotion': row['YearsSinceLastPromotion'],
                'YearsWithCurrManager': row['YearsWithCurrManager'],
            }
        )

print("CSV data has been loaded into the Django database.")
