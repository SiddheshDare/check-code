from django.urls import path
from .views import (
    TrainChurnModelView, 
    PredChurnModelView, 
    get_prefilled_prediction_data, 
    get_employee_details,
    ModelListView,
    ModelDetailView,
    add_employee 
)

urlpatterns = [
    path('training', TrainChurnModelView.as_view(), name='model_training'),
    path('prediction/', PredChurnModelView.as_view(), name='model_prediction'),
    path('models/', ModelListView.as_view(), name='model-list'),
    path('models/<uuid:model_id>/', ModelDetailView.as_view(), name='model-detail'),
    path('prediction/prefilled-predictions/', get_prefilled_prediction_data),
    path('prediction/prefilled-predictions/<int:employee_number>/', get_employee_details),
    path('employees/add/', add_employee, name='add-employee'),
]