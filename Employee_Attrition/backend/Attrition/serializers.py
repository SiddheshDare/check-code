from rest_framework import serializers
from .models import EmployeeData

class EmployeeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeData
        fields = '__all__'

class EmployeeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeData
        exclude = ['EmployeeNumber', 'Attrition']
        extra_kwargs = {
            'Age': {'required': True},
            'BusinessTravel': {'required': True},
            'Department': {'required': True},
            # Add all other required fields
        }
    
    def validate(self, data):
        # Validate categorical fields
        categorical_checks = {
            'BusinessTravel': ['Non-Travel', 'Travel_Rarely', 'Travel_Frequently'],
            'Department': ['Research & Development', 'Sales', 'Human Resources'],
            'EducationField': ['Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Other'],
            'Gender': ['Male', 'Female'],
            'JobRole': ['Research Scientist', 'Laboratory Technician', 'Sales Executive', 'Manager'],
            'MaritalStatus': ['Single', 'Married', 'Divorced'],
            'Over18': ['Y', 'N'],
            'OverTime': ['No', 'Yes']
        }
        
        for field, allowed_values in categorical_checks.items():
            if field in data and data[field] not in allowed_values:
                raise serializers.ValidationError({
                    field: f"Must be one of: {', '.join(allowed_values)}"
                })
        
        # Validate rating fields (1-5)
        rating_fields = [
            'EnvironmentSatisfaction', 'JobInvolvement', 'JobLevel',
            'JobSatisfaction', 'PerformanceRating', 'RelationshipSatisfaction',
            'WorkLifeBalance'
        ]
        
        for field in rating_fields:
            if field in data and (data[field] < 1 or data[field] > 5):
                raise serializers.ValidationError({
                    field: "Must be between 1 and 5"
                })
        
        return data
    
    def create(self, validated_data):
        # Set default Attrition to 'No' for new employees
        validated_data['Attrition'] = 'No'
        return super().create(validated_data)