# Heart Disease Risk Prediction

### Early Heart Disease Risk Analysis and Predictive Analytics
This repository hosts a research-driven machine learning project focused on the early detection of cardiovascular pathologies. By leveraging supervised learning, the study benchmarks multiple architectures to optimize diagnostic sensitivity and model interpretability in clinical decision-support systems.

---

## Research Objectives
The primary goal of this study is to move beyond simple accuracy and focus on metrics that matter in a healthcare context.
* **Comparative Architecture Benchmarking:** Evaluation of Logistic Regression, Random Forest, and Support Vector Machines (SVM) to determine the most reliable classifier for medical tabular data.
* **Metric Optimization for Clinical Safety:** Prioritizing **ROC-AUC** and **Recall (Sensitivity)**. In medical diagnostics, a false negative is more costly than a false positive; thus, we focus on minimizing the "miss" rate of heart disease.
* **Feature Interpretability:** Utilizing feature importance rankings to identify which biomarkers (e.g., cholesterol, age, blood pressure) most significantly influence the risk of heart disease.

## Technical Architecture
A modular full-stack approach was used to bridge the gap between machine learning research and practical application.
* **Backend:** Python 3.9+, Flask (Web Server Gateway Interface).
* **Machine Learning Stack:** Scikit-learn (Model Training), Pandas (Data Manipulation), NumPy (Numerical Analysis).
* **Serialization:** Pickle protocol for high-performance model persistence and retrieval.
* **Frontend Design:** Responsive UI built with HTML5, CSS3, and JavaScript for real-time risk assessment and data visualization.



## Dataset and Methodology
The investigation followed a rigorous data science pipeline to ensure scientific validity:
1. **Exploratory Data Analysis (EDA):** Identifying correlations between variables such as ST-segment depression and major vessel fluoroscopy.
2. **Data Preprocessing:** Standardized scaling of continuous variables and handling high-dimensional variance to stabilize gradient-based solvers.
3. **Architecture Selection:** We contrasted the high-bias/low-variance nature of Logistic Regression against the low-bias/high-variance nature of Ensemble methods (Random Forest).
4. **High-Sensitivity Tuning:** Fine-tuning decision thresholds ($\tau$) to ensure the model captures early-stage pathology even at the cost of slight precision decreases.

## Project Structure
The repository is organized to separate research logic from production-ready inference code:
```text
├── app.py                  # Main Flask entry point; handles API requests
├── main.py                 # Training pipeline; includes preprocessing and training logic
├── heart_diseas_model.pkl  # Trained binary classifier for general heart disease
├── cholesterol_model.pkl   # Specialized model for cholesterol-specific risk
├── templates/              # Clinical dashboard and user input interfaces
└── static/                 # CSS/JS assets for the front-end visualization
