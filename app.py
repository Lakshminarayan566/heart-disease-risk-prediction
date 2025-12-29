import os
import logging
import json
import pandas as pd
import joblib
import numpy as np
from flask import Flask, render_template, request, jsonify, url_for

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key")

# Load the trained models
try:
    heart_model = joblib.load('heart_diseas_model.pkl')
    cholesterol_model = joblib.load('cholesterol_model.pkl')
    logging.info("ML models loaded successfully")
except Exception as e:
    logging.error(f"Error loading ML models: {str(e)}")
    heart_model = None
    cholesterol_model = None

@app.route('/')
def index():
    """Render the main heart disease risk prediction page"""
    return render_template('enhanced_index.html')

@app.route('/bmi')
def bmi_calculator():
    """Render the BMI calculator page"""
    return render_template('bmi.html')

@app.route('/cholesterol')
def cholesterol_predictor():
    """Render the cholesterol predictor page"""
    return render_template('cholesterol.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict heart disease risk based on user inputs using the machine learning model
    """
    try:
        data = request.get_json()
        logging.debug(f"Received prediction request with data: {data}")
        
        # Check if model is loaded
        if heart_model is not None:
            # Create a dataframe with the required features for prediction
            input_data = pd.DataFrame([{
                'Age': float(data.get('Age', 0)),
                'Gender': 1 if data.get('Gender', 'Male') == 'Male' else 0,
                'BMI': float(data.get('BMI', 0)),
                'Smoking': 1 if data.get('Smoking', 'No') == 'Yes' else 0,
                'Alcohol_Intake': 1 if data.get('Alcohol_Intake', 'No') == 'Yes' else 0,
                'Physical_Activity': float(data.get('Physical_Activity', 0)),
                'Salt_Intake': float(data.get('Salt_Intake', 0)),
                'Blood_Pressure': float(data.get('Blood_Pressure', 0)),
                'Cholesterol': float(data.get('Cholesterol', 0)),
                'Diabetes': 1 if data.get('Diabetes', 'No') == 'Yes' else 0,
                'Hypertension': 1 if data.get('Hypertension', 'No') == 'Yes' else 0,
                'BMI_Age': float(data.get('BMI', 0)) * float(data.get('Age', 0)),
                'BP_Chol': float(data.get('Blood_Pressure', 0)) * float(data.get('Cholesterol', 0))
            }])
            
            # Make prediction using the model
            try:
                prediction = heart_model.predict(input_data)[0]
                # Convert to float if necessary
                prediction = float(prediction)
                # Ensure prediction is between 0 and 100 for percentage display
                prediction = max(0, min(100, prediction))
                
                logging.debug(f"Model prediction: {prediction}")
                return jsonify({"prediction": prediction})
            except Exception as model_error:
                logging.error(f"Error using heart model: {str(model_error)}")
                # Fall back to the formula-based approach
                return fallback_heart_prediction(data)
        else:
            logging.warning("Heart disease model not available, using fallback prediction")
            return fallback_heart_prediction(data)
    
    except Exception as e:
        logging.error(f"Error in prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

def fallback_heart_prediction(data):
    """Fallback method if the model is not available"""
    # Extract features and convert to appropriate types
    age = float(data.get('Age', 0))
    bmi = float(data.get('BMI', 0))
    smoking = 1 if data.get('Smoking', 'No') == 'Yes' else 0
    alcohol = 1 if data.get('Alcohol_Intake', 'No') == 'Yes' else 0
    physical_activity = float(data.get('Physical_Activity', 0))
    salt_intake = float(data.get('Salt_Intake', 0))
    blood_pressure = float(data.get('Blood_Pressure', 0))
    cholesterol = float(data.get('Cholesterol', 0))
    diabetes = 1 if data.get('Diabetes', 'No') == 'Yes' else 0
    hypertension = 1 if data.get('Hypertension', 'No') == 'Yes' else 0
    
    # Simple risk calculation for demonstration (not medically valid)
    base_risk = 10  # Base risk percentage
    
    # Age risk factor (higher age = higher risk)
    age_risk = (age - 30) * 0.5 if age > 30 else 0
    
    # BMI risk factor
    bmi_risk = (bmi - 25) * 2 if bmi > 25 else 0
    
    # Smoking and alcohol risk factors
    smoking_risk = 15 if smoking else 0
    alcohol_risk = 10 if alcohol else 0
    
    # Physical activity protective factor
    activity_protection = min(physical_activity * 1.5, 15)
    
    # Salt intake risk factor
    salt_risk = (salt_intake - 5) * 1 if salt_intake > 5 else 0
    
    # Blood pressure and cholesterol risk factors
    bp_risk = (blood_pressure - 120) * 0.2 if blood_pressure > 120 else 0
    chol_risk = (cholesterol - 200) * 0.1 if cholesterol > 200 else 0
    
    # Diabetes and hypertension risk factors
    diabetes_risk = 20 if diabetes else 0
    hypertension_risk = 15 if hypertension else 0
    
    # Calculate total risk percentage (capped between 0 and 100)
    total_risk = base_risk + age_risk + bmi_risk + smoking_risk + alcohol_risk - activity_protection + salt_risk + bp_risk + chol_risk + diabetes_risk + hypertension_risk
    
    # Ensure risk is between 0 and 100
    total_risk = max(0, min(100, total_risk))
    
    return jsonify({"prediction": total_risk})

@app.route('/predict_cholesterol', methods=['POST'])
def predict_cholesterol():
    """
    Predict cholesterol level based on nutritional inputs using the machine learning model
    """
    try:
        data = request.get_json()
        logging.debug(f"Received cholesterol prediction request with data: {data}")
        
        # Check if model is loaded
        if cholesterol_model is not None:
            # Create a dataframe with the required features for prediction
            input_data = pd.DataFrame([{
                'Fat_Intake': float(data.get('Fat_Intake', 0)),
                'Protein_Intake': float(data.get('Protein_Intake', 0)),
                'Carbohydrate_Intake': float(data.get('Carbohydrate_Intake', 0))
            }])
            
            # Make prediction using the model
            try:
                prediction = cholesterol_model.predict(input_data)[0]
                # Convert to float if necessary
                prediction = float(prediction)
                # Ensure prediction is within reasonable range for cholesterol levels (mg/dL)
                prediction = max(120, min(300, prediction))
                
                logging.debug(f"Cholesterol model prediction: {prediction}")
                return jsonify({"prediction": prediction})
            except Exception as model_error:
                logging.error(f"Error using cholesterol model: {str(model_error)}")
                # Fall back to the formula-based approach
                return fallback_cholesterol_prediction(data)
        else:
            logging.warning("Cholesterol model not available, using fallback prediction")
            return fallback_cholesterol_prediction(data)
    
    except Exception as e:
        logging.error(f"Error in cholesterol prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

def fallback_cholesterol_prediction(data):
    """Fallback method if the cholesterol model is not available"""
    # Extract features
    fat_intake = float(data.get('Fat_Intake', 0))
    protein_intake = float(data.get('Protein_Intake', 0))
    carb_intake = float(data.get('Carbohydrate_Intake', 0))
    
    # Simple cholesterol prediction calculation (not medically valid)
    base_cholesterol = 150
    
    # Fat has the most significant impact on cholesterol
    fat_factor = fat_intake * 0.5
    
    # Protein has a moderate impact
    protein_factor = protein_intake * 0.2
    
    # Carbohydrates have a lower impact
    carb_factor = carb_intake * 0.1
    
    # Calculate total cholesterol (mg/dL)
    predicted_cholesterol = base_cholesterol + fat_factor + protein_factor + carb_factor
    
    # Ensure prediction is within reasonable range
    predicted_cholesterol = max(120, min(300, predicted_cholesterol))
    
    return jsonify({"prediction": predicted_cholesterol})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
