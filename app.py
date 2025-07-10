import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

def load_and_preprocess():
    data = pd.read_csv('data/creditcard.csv')

    # Drop duplicates
    data = data.drop_duplicates()

    # Split features and target
    X = data.drop('Class', axis=1)
    y = data['Class']

    # Scale all features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Handle class imbalance
    X_res, y_res = SMOTE().fit_resample(X_scaled, y)

    return train_test_split(X_res, y_res, test_size=0.2, random_state=42), scaler

def train_and_evaluate_models(X_train, X_test, y_train, y_test):
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Random Forest": RandomForestClassifier(n_estimators=50),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    }

    final_results = []

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)

        print(f"\n{name} Results:")
        print(f"Accuracy: {acc:.4f}")
        print(f"Precision: {prec:.4f}")
        print(f"Recall: {rec:.4f}")
        print(f"F1 Score: {f1:.4f}")

        final_results.append((name, acc))

    return models["XGBoost"]

def save_model(model, filename="credit_card_model.pkl"):
    joblib.dump(model, filename)
    print(f"\nModel saved as: {filename}")

def load_model(filename="credit_card_model.pkl"):
    return joblib.load(filename)

def predict_sample(model, sample_input):
    try:
        pred = model.predict([sample_input])
        print("\nSample Prediction:")
        if pred[0] == 0:
            print("Normal Transaction")
        else:
            print("Fraudulent Transaction")
    except Exception as e:
        print("Prediction error:", e)

def main():
    (X_train, X_test, y_train, y_test), scaler = load_and_preprocess()

    # Train models and get best model
    best_model = train_and_evaluate_models(X_train, X_test, y_train, y_test)

    save_model(best_model)

    # Load and simulate prediction
    model = load_model()
    dummy_input = [1.0] * X_train.shape[1]
    predict_sample(model, dummy_input)

if __name__ == "__main__":
    main()
