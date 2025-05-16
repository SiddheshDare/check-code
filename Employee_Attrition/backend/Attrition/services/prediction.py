import os
import pandas as pd
import json
import pickle
from rest_framework import status
import logging
from collections import defaultdict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename=os.path.join(os.getcwd(), 'log', 'prediction.log'))
logger = logging.getLogger(__name__)

class Prediction:
    def __init__(self):
        self.base_path = os.getcwd()
        self.pickle_path = os.path.normpath(os.path.join(self.base_path, 'pickle'))
        self.models_dir = os.path.normpath(os.path.join(self.pickle_path, 'models'))
        self.metadata_file = os.path.normpath(os.path.join(self.pickle_path, 'model_metadata.json'))
        os.makedirs(self.models_dir, exist_ok=True)

    def get_available_models(self):
        """Get list of available models with their metadata"""
        try:
            with open(self.metadata_file, 'r') as f:
                metadata = json.load(f)
            return metadata.get('models', [])
        except Exception as e:
            logger.error(f"Error loading model metadata: {str(e)}")
            return []

    def load_model(self, model_id):
        """Load the trained model with error handling"""
        try:
            # Find model filename from metadata
            with open(self.metadata_file, 'r') as f:
                metadata = json.load(f)
            
            model_info = next((m for m in metadata['models'] if m['model_id'] == model_id), None)
            if not model_info:
                raise ValueError(f"Model with ID {model_id} not found")
                
            pickle_file = os.path.join(self.models_dir, model_info['filename'])
            if not os.path.exists(pickle_file):
                raise FileNotFoundError(f"Model file {model_info['filename']} not found")
                
            with open(pickle_file, 'rb') as f:
                model_data = pickle.load(f)
                
            if not isinstance(model_data, dict) or 'model' not in model_data:
                raise ValueError("Invalid model file format")
                
            return model_data['model'], model_data.get('feature_names')
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise

    def preprocess_input(self, input_data, expected_features):
        """Preprocess the input data to match training format"""
        try:
            # Convert JSON to DataFrame
            df_pred = pd.json_normalize(input_data)
            logger.info(f"Input data shape: {df_pred.shape}")
            
            # One-hot encode categorical features
            df_pred = pd.get_dummies(df_pred)
            
            # Ensure all expected features are present
            for feature in expected_features:
                if feature not in df_pred.columns:
                    df_pred[feature] = 0  # Add missing features with 0
                    logger.warning(f"Added missing feature: {feature}")
            
            # Ensure correct feature order
            df_pred = df_pred[expected_features]
            
            return df_pred
            
        except Exception as e:
            logger.error(f"Error preprocessing input: {str(e)}")
            raise

    def predict(self, request):
        """Make predictions on new data with selected model"""
        response = {
            'status': status.HTTP_200_OK,
            'response': None,
            'error': None
        }
        
        try:
            # Parse input data
            try:
                input_data = json.loads(request.body.decode('utf-8'))
                model_id = input_data.get('model_id')
                if not model_id:
                    raise ValueError("model_id is required")
                
                prediction_data = input_data.get('data')
                if not prediction_data:
                    raise ValueError("Prediction data is required")
                    
                logger.info(f"Received prediction request for model {model_id}")
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON input")
            
            # Load model and feature names
            model, feature_names = self.load_model(model_id)
            if feature_names is None:
                raise ValueError("Feature names not found in model file")
            
            # Preprocess input data
            df_pred = self.preprocess_input(prediction_data, feature_names)
            
            # Make prediction
            prediction = model.predict(df_pred)
            probabilities = model.predict_proba(df_pred)
            
            # Prepare response
            result = {
                "prediction": "Yes" if prediction[0] == 1 else "No",
                "probability": float(probabilities[0][1]),  # Probability of "Yes"
                "confidence": self._get_confidence_level(probabilities[0][1]),
                "model_id": model_id
            }
            
            response['response'] = result
            logger.info(f"Prediction successful: {result}")
            
        except Exception as e:
            error_msg = f"Prediction error: {str(e)}"
            logger.error(error_msg, exc_info=True)
            response.update({
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'error': error_msg
            })
        
        return response

    def _get_confidence_level(self, probability):
        """Convert probability to confidence level"""
        if probability > 0.8 or probability < 0.2:
            return "High"
        elif probability > 0.7 or probability < 0.3:
            return "Medium"
        return "Low"