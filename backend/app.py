from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from preprocess import preprocess_data
from collections import Counter

app = Flask(__name__)
CORS(app)

# Load model artifacts
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
features = joblib.load("features.pkl")

analytics_data = {
    "predictions": []
}

@app.route("/")
def home():
    return "API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    transaction_datetime = pd.to_datetime(f"{data['trans_date']} {data['trans_time']}")
    user_input = pd.DataFrame([{
        "trans_date_trans_time": transaction_datetime,
        "category": data["category"],
        "amt": data["amount"],
        "lat": data["lat"],
        "long": data["long"],
        "merch_lat": data["merch_lat"],
        "merch_long": data["merch_long"],
        "job": data["job"],
    }])
    

    df_processed, _ = preprocess_data(user_input, feature_columns=features)
    X_scaled = scaler.transform(df_processed)

    prediction = model.predict(X_scaled)[0]
    proba = model.predict_proba(X_scaled)[0][1]

    risk = "Low"
    if proba > 0.8:
        risk = "High"
    elif proba > 0.5:
        risk = "Medium"

    # ✅ Store required fields for analytics
    analytics_data["predictions"].append({
        "category": data["category"],
        "risk_level": risk,
        "probability": proba,
        "prediction": int(prediction),
        "lat": data["lat"],
        "long": data["long"],
        "amount": data["amount"]  # Optional: for tooltip display
    })

    print("Logged prediction:", analytics_data["predictions"][-1])


    return jsonify({
        "prediction": int(prediction),
        "probability": float(proba),
        "risk_level": risk
    })

@app.route("/analytics", methods=["GET"])
def analytics():
    preds = analytics_data["predictions"]
    if not preds:
        return jsonify({
            "fraud_by_category": [],
            "risk_levels": [],
            "feature_importance": []
        })

    category_counts = Counter([p["category"] for p in preds])
    risk_counts = Counter([p["risk_level"] for p in preds])

    try:
        importances = model.feature_importances_
        feature_importance = [
            {"feature": str(feat), "importance": round(float(imp), 4)}
            for feat, imp in zip(features, importances)
        ]
        feature_importance.sort(key=lambda x: x["importance"], reverse=True)
    except AttributeError:
        feature_importance = []

    heatmap_data = [
    {"lat": p["lat"], "long": p["long"]}
    for p in preds
    ]

    return jsonify({
        "fraud_by_category": [{"category": k, "count": v} for k, v in category_counts.items()],
        "risk_levels": [{"level": k, "count": v} for k, v in risk_counts.items()],
        "heatmap": [
        {"lat": p["lat"], "long": p["long"]}
        for p in preds
        ],
        "feature_importance": feature_importance
    })

if __name__ == "__main__":
    app.run(debug=True)
