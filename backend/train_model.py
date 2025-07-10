import pandas as pd
import numpy as np
import random
import joblib
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import (
    confusion_matrix, classification_report,
    roc_auc_score, f1_score, roc_curve, precision_recall_curve
)
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from preprocess import preprocess_data

# Fix seeds for reproducibility
np.random.seed(42)
random.seed(42)

def train_and_evaluate():
    # Load data
    train_df = pd.read_csv("data/fraudTrain.csv")
    test_df = pd.read_csv("data/fraudTest.csv")

    # Sample and balance training set
    train_df = train_df.sample(n=300000, random_state=42)
    frauds = train_df[train_df['is_fraud'] == 1]
    non_frauds = train_df[train_df['is_fraud'] == 0].sample(n=len(frauds)*10, random_state=42)
    train_df = pd.concat([frauds, non_frauds]).sample(frac=1, random_state=42)

    # Stratified sample test set to increase frauds
    frauds_test = test_df[test_df['is_fraud'] == 1]
    non_frauds_test = test_df[test_df['is_fraud'] == 0]
    n_frauds = min(len(frauds_test), 100)
    sampled_frauds = frauds_test.sample(n=n_frauds, random_state=42)
    sampled_non_frauds = non_frauds_test.sample(n=2000 - n_frauds, random_state=42)
    test_df = pd.concat([sampled_frauds, sampled_non_frauds]).sample(frac=1, random_state=42)

    # Extract labels
    y_train = train_df['is_fraud']
    y_test = test_df['is_fraud']

    # Preprocess features
    X_train_processed, features = preprocess_data(train_df.drop(columns=['is_fraud']))
    X_test_processed, _ = preprocess_data(test_df.drop(columns=['is_fraud']), feature_columns=features)

    # Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_processed)
    X_test_scaled = scaler.transform(X_test_processed)

    # SMOTE
    smote = SMOTE(sampling_strategy=1.0, random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)

    # Save preprocessors
    joblib.dump(scaler, "scaler.pkl")
    joblib.dump(features, "features.pkl")

    # Train and evaluate models
    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=200, max_depth=15,
            random_state=42, class_weight='balanced_subsample'
        ),
        "XGBoost": XGBClassifier(
            use_label_encoder=False,
            eval_metric='logloss',
            random_state=42
        )
    }

    best_model = None
    best_f1 = 0
    best_name = ""

    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train_res, y_train_res)
        y_pred = model.predict(X_test_scaled)
        y_proba = model.predict_proba(X_test_scaled)[:, 1]

        print(f"\n{name} Evaluation:")
        print(confusion_matrix(y_test, y_pred))
        print(classification_report(y_test, y_pred))
        roc_auc = roc_auc_score(y_test, y_proba)
        f1 = f1_score(y_test, y_pred)
        print(f"ROC AUC: {roc_auc:.4f}, F1: {f1:.4f}")

        # Save best model
        if f1 > best_f1:
            best_model = model
            best_name = name
            best_f1 = f1
            joblib.dump(model, "model.pkl")
            y_best_pred = y_pred
            y_best_proba = y_proba

        # Plot ROC
        fpr, tpr, _ = roc_curve(y_test, y_proba)
        plt.plot(fpr, tpr, label=f'{name} (AUC={roc_auc:.2f})')

    plt.plot([0, 1], [0, 1], 'k--')
    plt.title('ROC Curve')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.legend()
    plt.show()

    # Precision-Recall curve for best model
    precisions, recalls, thresholds = precision_recall_curve(y_test, y_best_proba)
    plt.plot(thresholds, precisions[:-1], label='Precision')
    plt.plot(thresholds, recalls[:-1], label='Recall')
    plt.xlabel('Threshold')
    plt.ylabel('Score')
    plt.title(f'Precision-Recall vs Threshold ({best_name})')
    plt.legend()
    plt.grid()
    plt.show()

    # Custom thresholds
    for thresh in [0.1, 0.2, 0.3, 0.5]:
        y_custom = (y_best_proba >= thresh).astype(int)
        print(f"\n--- Custom threshold: {thresh} ---")
        print(confusion_matrix(y_test, y_custom))
        print(classification_report(y_test, y_custom))

    # Missed frauds
    missed_frauds = test_df[(y_test == 1) & (y_best_pred == 0)]
    print("\nMissed frauds in test set:", missed_frauds.shape[0])

    # Final summary
    print(f"\n✅ Best model: {best_name}")
    print(confusion_matrix(y_test, y_best_pred))
    print(classification_report(y_test, y_best_pred))
    print("ROC AUC Score:", roc_auc_score(y_test, y_best_proba))

if __name__ == "__main__":
    train_and_evaluate()
