import os
import traceback
import pandas as pd
import numpy as np
from rest_framework import status
import pickle
import json
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, recall_score, accuracy_score, precision_score, confusion_matrix, classification_report
from Attrition.models import EmployeeData
import logging
from collections import defaultdict
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename=os.path.join(os.getcwd(), 'log', 'training.log'))
logger = logging.getLogger(__name__)

class Training:
    def __init__(self):
        self.base_path = os.getcwd()
        self.pickle_path = os.path.normpath(os.path.join(self.base_path, 'pickle', 'models'))
        self.metadata_path = os.path.normpath(os.path.join(self.base_path, 'pickle', 'model_metadata.json'))
        os.makedirs(self.pickle_path, exist_ok=True)
        
        # Initialize model metadata file if it doesn't exist
        if not os.path.exists(self.metadata_path):
            with open(self.metadata_path, 'w') as f:
                json.dump({"models": []}, f)

    def accuracy_measures(self, y_test, predictions, avg_method='weighted'):
        """Calculate and log various accuracy metrics"""
        metrics = defaultdict(float)
        
        metrics['accuracy'] = accuracy_score(y_test, predictions)
        metrics['precision'] = precision_score(y_test, predictions, average=avg_method)
        metrics['recall'] = recall_score(y_test, predictions, average=avg_method)
        metrics['f1_score'] = f1_score(y_test, predictions, average=avg_method)
        
        target_names = ['0', '1']
        logger.info("Classification Report:\n%s", 
                   classification_report(y_test, predictions, target_names=target_names))
        logger.info("Confusion Matrix:\n%s", confusion_matrix(y_test, predictions))
        
        for metric, value in metrics.items():
            logger.info("%s: %.4f", metric.capitalize(), value)
            
        return metrics

    def preprocess_data(self, attrition_df, selected_features=None):
        """Preprocess the data including encoding and feature engineering"""
        # Convert target variable
        target_map = {'True': 1, 'False': 0}
        target = attrition_df["Attrition"].map(target_map)
        
        # Separate features
        categorical_features = attrition_df.select_dtypes(include=['object']).columns.drop('Attrition')
        numerical_features = attrition_df.select_dtypes(exclude=['object']).columns
        
        # One-hot encode categorical features
        attrition_cat = pd.get_dummies(attrition_df[categorical_features], drop_first=True)
        attrition_num = attrition_df[numerical_features]
        
        # Combine features
        features = pd.concat([attrition_num, attrition_cat], axis=1)
        
        # Filter selected features if provided
        if selected_features:
            available_features = set(features.columns)
            selected_features = [f for f in selected_features if f in available_features]
            features = features[selected_features]
        
        return features, target

    def train_model(self, train_data, train_target, test_data, test_target, model_params):
        """Train Random Forest model with SMOTE oversampling"""
        # Handle class imbalance
        smote = SMOTE(random_state=42)
        smote_train, smote_target = smote.fit_resample(train_data, train_target)
        
        # Default parameters with override from input
        rf_params = {
            'n_jobs': -1,
            'n_estimators': 1000,
            'max_features': 'sqrt',
            'max_depth': 4,
            'min_samples_leaf': 2,
            'random_state': 42,
            'verbose': 0
        }
        rf_params.update(model_params)
        
        # Train model
        model = RandomForestClassifier(**rf_params)
        model.fit(smote_train, smote_target)
        
        # Evaluate model
        predictions = model.predict(test_data)
        metrics = self.accuracy_measures(test_target, predictions)
        
        return model, metrics, rf_params

    def save_model(self, model, feature_names, model_params, metrics):
        """Save model and metadata"""
        model_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        # Model data to save
        model_data = {
            'model': model,
            'feature_names': feature_names,
            'model_params': model_params,
            'metrics': metrics,
            'model_id': model_id,
            'timestamp': timestamp
        }
        
        # Save model file
        model_filename = f"model_{model_id}.sav"
        model_path = os.path.join(self.pickle_path, model_filename)
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        # Update metadata
        with open(self.metadata_path, 'r') as f:
            metadata = json.load(f)
        
        metadata['models'].append({
            'model_id': model_id,
            'filename': model_filename,
            'timestamp': timestamp,
            'params': model_params,
            'metrics': metrics,
            'features': feature_names
        })
        
        with open(self.metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info(f"Model saved successfully as {model_filename}")
        return model_id

    def get_available_models(self):
        """Get list of available models with their metadata"""
        try:
            with open(self.metadata_path, 'r') as f:
                metadata = json.load(f)
            return metadata.get('models', [])
        except Exception as e:
            logger.error(f"Error loading model metadata: {str(e)}")
            return []

    def train(self, request):
        """Main training pipeline"""
        response = {
            'status': status.HTTP_200_OK,
            'response': 'Model trained successfully',
            'metrics': {},
            'model_id': None
        }
        
        try:
            # Parse request data
            try:
                request_data = json.loads(request.body.decode('utf-8'))
                model_params = request_data.get('model_params', {})
                selected_features = request_data.get('features', None)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON input")
            
            # Load data
            logger.info("Loading data from database...")
            all_data = EmployeeData.objects.all().order_by("EmployeeNumber")
            df = pd.DataFrame(list(all_data.values()))
            
            if len(df) < 100:  # Minimum data threshold
                raise ValueError("Insufficient data for training")
            
            # Split into train/test
            train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
            
            # Preprocess data
            logger.info("Preprocessing data...")
            train_features, train_target = self.preprocess_data(train_df, selected_features)
            test_features, test_target = self.preprocess_data(test_df, selected_features)
            
            # Train model
            logger.info("Training model with parameters: %s", model_params)
            model, metrics, final_params = self.train_model(
                train_features, train_target, 
                test_features, test_target,
                model_params
            )
            
            # Save model and metadata
            model_id = self.save_model(
                model, 
                train_features.columns.tolist(),
                final_params,
                metrics
            )
            
            # Update response
            response.update({
                'metrics': metrics,
                'model_id': model_id
            })
            logger.info("Training completed successfully")
            
        except Exception as e:
            error_msg = f"Exception during training: {str(e)}"
            logger.error(error_msg, exc_info=True)
            
            response.update({
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'response': error_msg
            })
        
        return response