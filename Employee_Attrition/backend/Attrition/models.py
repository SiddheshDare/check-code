from django.db import models

class EmployeeData(models.Model):
    Age = models.IntegerField()
    Attrition = models.CharField(max_length=3)  # 'Yes' or 'No'
    BusinessTravel = models.CharField(max_length=50)
    DailyRate = models.IntegerField()
    Department = models.CharField(max_length=100)
    DistanceFromHome = models.IntegerField()
    Education = models.IntegerField()
    EducationField = models.CharField(max_length=100)
    EmployeeCount = models.IntegerField()
    EmployeeNumber = models.IntegerField(primary_key=True)  # Assuming it's a unique identifier
    EnvironmentSatisfaction = models.IntegerField()
    Gender = models.CharField(max_length=10)
    HourlyRate = models.IntegerField()
    JobInvolvement = models.IntegerField()
    JobLevel = models.IntegerField()
    JobRole = models.CharField(max_length=100)
    JobSatisfaction = models.IntegerField()
    MaritalStatus = models.CharField(max_length=50)
    MonthlyIncome = models.IntegerField()
    MonthlyRate = models.IntegerField()
    NumCompaniesWorked = models.IntegerField()
    Over18 = models.CharField(max_length=5)
    OverTime = models.CharField(max_length=5)
    PercentSalaryHike = models.IntegerField()
    PerformanceRating = models.IntegerField()
    RelationshipSatisfaction = models.IntegerField()
    StandardHours = models.IntegerField()
    StockOptionLevel = models.IntegerField()
    TotalWorkingYears = models.IntegerField()
    TrainingTimesLastYear = models.IntegerField()
    WorkLifeBalance = models.IntegerField()
    YearsAtCompany = models.IntegerField()
    YearsInCurrentRole = models.IntegerField()
    YearsSinceLastPromotion = models.IntegerField()
    YearsWithCurrManager = models.IntegerField()

    def __str__(self):
        return f"{self.employee_number} - Attrition: {self.attrition}"

