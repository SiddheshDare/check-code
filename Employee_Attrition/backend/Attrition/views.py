from django.shortcuts import render
from rest_framework.response import Response 
from rest_framework.views import APIView
from Attrition.services.prediction import Prediction
from Attrition.services.training import Training 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import EmployeeData
import pandas as pd
from .serializers import EmployeeDataSerializer, EmployeeCreateSerializer
from rest_framework import status
import json

class TrainChurnModelView(APIView):
    def post(self, request):
        try:
            # Initialize training service
            train_obj = Training()
            
            # Get training configuration from request
            request_data = request.data
            model_params = request_data.get('model_params', {})
            features = request_data.get('features', None)
            
            # Create a mock request object compatible with your existing training service
            class MockRequest:
                def __init__(self, data):
                    self.body = json.dumps(data).encode('utf-8')
            
            mock_request = MockRequest(request_data)
            
            # Execute training
            response_dict = train_obj.train(mock_request)
            
            return Response(response_dict, status=response_dict.get('status', status.HTTP_200_OK))
            
        except Exception as e:
            return Response(
                {'error': str(e), 'response': 'Training failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PredChurnModelView(APIView): 
    def post(self, request):
        try:
            # Initialize prediction service
            pred_obj = Prediction()
            
            # Get prediction request data
            request_data = request.data
            model_id = request_data.get('model_id')
            prediction_data = request_data.get('data')
            
            # Create a mock request object compatible with your existing prediction service
            class MockRequest:
                def __init__(self, data):
                    self.body = json.dumps(data).encode('utf-8')
            
            mock_request = MockRequest(request_data)
            
            # Execute prediction
            response_dict = pred_obj.predict(mock_request)
            
            return Response(response_dict, status=response_dict.get('status', status.HTTP_200_OK))
            
        except Exception as e:
            return Response(
                {'error': str(e), 'response': 'Prediction failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ModelListView(APIView):
    def get(self, request):
        try:
            trainer = Training()
            models = trainer.get_available_models()
            return Response({'models': models}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ModelDetailView(APIView):
    def get(self, request, model_id):
        try:
            trainer = Training()
            model_details = trainer.get_model_details(str(model_id))
            return Response(model_details, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
def get_prefilled_prediction_data(request):
    try:
        all_data = EmployeeData.objects.all().order_by("EmployeeNumber")
        df = pd.DataFrame(list(all_data.values()))
        prefilled_data = df.iloc[1450:]
        employee_numbers = prefilled_data["EmployeeNumber"].tolist()
        formatted_response = [{"employeeNumber": num} for num in employee_numbers]
        return Response(formatted_response, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_employee_details(request, employee_number):
    try:
        employee = EmployeeData.objects.get(EmployeeNumber=employee_number)
        serializer = EmployeeDataSerializer(employee)
        return Response(serializer.data, status=200)
    except EmployeeData.DoesNotExist:
        return Response(
            {"error": f"Employee with number {employee_number} not found."},
            status=404
        )
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    


@api_view(['POST'])
def add_employee(request):
    try:
        # Get the highest current employee number
        last_employee = EmployeeData.objects.all().order_by('-EmployeeNumber').first()
        new_employee_number = (last_employee.EmployeeNumber + 1) if last_employee else 1
        
        # Create serializer with request data
        serializer = EmployeeCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save with the new employee number
            employee = serializer.save(EmployeeNumber=new_employee_number)
            
            # Return success response with full employee data
            return Response({
                'success': True,
                'employee_number': new_employee_number,
                'data': EmployeeDataSerializer(employee).data
            }, status=status.HTTP_201_CREATED)
        else:
            # Return validation errors
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
