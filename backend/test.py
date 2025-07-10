import pandas as pd
import numpy as np
import joblib
from preprocess import preprocess_data
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score

# Load model artifacts
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
features = joblib.load("features.pkl")

# Flatten features if needed
if isinstance(features, np.ndarray):
    features = features.flatten().tolist()
elif isinstance(features[0], list):
    features = [item for sublist in features for item in sublist]

# Load test data
df = pd.read_csv("data/fraudTest.csv")

# Split into fraud and non-fraud
df_fraud = df[df["is_fraud"] == 1]
df_nonfraud = df[df["is_fraud"] == 0]

# Preprocess both sets
X_fraud, _ = preprocess_data(df_fraud.drop(columns=["is_fraud"]), feature_columns=features)
X_nonfraud, _ = preprocess_data(df_nonfraud.drop(columns=["is_fraud"]), feature_columns=features)

# Add any missing columns
for col in features:
    if col not in X_fraud.columns:
        X_fraud[col] = 0
    if col not in X_nonfraud.columns:
        X_nonfraud[col] = 0

# Ensure column order and type
X_fraud = X_fraud[features].astype(float)
X_nonfraud = X_nonfraud[features].astype(float)

# Scale
X_fraud_scaled = scaler.transform(X_fraud)
X_nonfraud_scaled = scaler.transform(X_nonfraud)

# Predict probabilities
fraud_probs = model.predict_proba(X_fraud_scaled)[:, 1]
nonfraud_probs = model.predict_proba(X_nonfraud_scaled)[:, 1]

# Risk thresholds
high_threshold = 0.9
medium_threshold = 0.7

# Actual labels
y_true = [1] * len(fraud_probs) + [0] * len(nonfraud_probs)

# Predicted labels
y_pred = []
for prob in fraud_probs:
    y_pred.append(1 if prob > high_threshold or prob > medium_threshold else 0)

for prob in nonfraud_probs:
    y_pred.append(1 if prob > high_threshold or prob > medium_threshold else 0)

# Metrics
accuracy = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)
cm = confusion_matrix(y_true, y_pred)
tn, fp, fn, tp = cm.ravel()

# Print results
print("Confusion Matrix:")
print(cm)
print(f"TP = {tp}, TN = {tn}, FP = {fp}, FN = {fn}\n")
print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")
