# 💳 Credit Card Fraud Detection Dashboard

An end-to-end web application for detecting and analyzing fraudulent credit card transactions using machine learning. Built with **Flask**, **React**, and **scikit-learn**.

## 📌 Features

- 🔍 **Predict Transactions** — Input transaction details and detect fraud risk in real-time.
- 📊 **Visual Analytics** — View insights such as fraud by category, risk level distribution, and feature importance.
- 📈 **Explainability** — See which features contribute most to fraud detection.

---

## 🛠 Tech Stack

### Frontend
- React.js 
- Recharts (for graphs and analytics)
- Tailwind CSS

### Backend
- Python
- Flask
- scikit-learn (model training & inference)
- joblib (for saving model artifacts)
- Pandas, NumPy

---

## 📁 Project Structure
```plaintext
credit-card-fraud-detection/
│
├── backend/
│ ├── app.py # Flask API
│ ├── preprocess.py # Data preprocessing logic
│ ├── model.pkl # Trained ML model
│ ├── scaler.pkl # Feature scaler
│ └── features.pkl # Saved feature list
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Home.jsx
│ │ │ ├── Predict.jsx
│ │ │ └── Analytics.jsx
│ │ ├── App.jsx
│ │ └── main.jsx
│ 
│
├── README.md
└── requirements.txt
```

## ▶️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/yashasvi-71/credit-card-fraud-detection.git
cd credit-card-fraud-detection
```
### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```
### 3. Frontend
```bash
cd frontend
npm start
```

📊 Example API Request
```bash
POST /predict
{
  "trans_date": "2023-07-01",
  "trans_time": "14:30:00",
  "category": "shopping_pos",
  "amount": 154.23,
  "lat": 37.7749,
  "long": -122.4194,
  "merch_lat": 37.7750,
  "merch_long": -122.4193,
  "job": "Engineer"
}
```