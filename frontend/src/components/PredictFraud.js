import React, { useState } from 'react';

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.25rem'
  },
  input: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  select: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  result: (isFraud, riskLevel) => {
  let borderColor = 'green';
  let backgroundColor = '#e5ffe5'; // safe

  if (isFraud) {
    if (riskLevel === 'High') {
      borderColor = 'red';
      backgroundColor = '#ffe5e5';
    } else if (riskLevel === 'Medium') {
      borderColor = '#e6b800';
      backgroundColor = '#fff8e1'; // soft yellow
    }
  }
  return {
    border: '2px solid',
    borderColor,
    backgroundColor,
    padding: '1rem',
    marginTop: '1rem',
    borderRadius: '8px',
    textAlign: 'center'
  };
},
  resultText: (isFraud) => ({
    color: isFraud ? 'red' : 'green',
    fontWeight: 'bold'
  }),
  ul: {
    paddingLeft: '1.2rem',
    listStyleType: 'disc',
    textAlign: 'left'
  },
  buttonSecondary: {
    padding: '0.5rem 1rem',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '1rem'
  },
  confidenceBar: {
  width: '100%',
  background: '#ddd',
  borderRadius: '8px',
  overflow: 'hidden',
  height: '10px'
  }
};

function App() {
  const initialForm = {
    amount: '',
    merchant: '',
    category: 'gas_transport',
    lat: '40.0',
    long: '-75.0',
    merch_lat: '40.0',
    merch_long: '-75.0',
    job: '',
    gender: 'M',
    state: '',
    city: '',
    trans_date: '',
    trans_time: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'gas_transport', 'shopping_net', 'shopping_pos', 'food_dining', 'home', 'entertainment',
    'health_fitness', 'travel', 'kids_pets', 'misc_net', 'misc_pos', 'personal_care'
  ];

  const jobs = [
    "Engineer","Doctor","Teacher","Lawyer","Artist","Scientist","Salesperson","Accountant",
    "Police Officer","Pharmacist","Psychologist","Student","Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.job || !formData.trans_date || !formData.trans_time) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.heading}>🔍 Credit Card Fraud Detection</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Transaction Amount*</label>
        <input style={styles.input} name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} />

        <label style={styles.label}>Category</label>
        <select style={styles.select} name="category" value={formData.category} onChange={handleChange}>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>

        <label style={styles.label}>User Latitude</label>
        <input style={styles.input} name="lat" type="number" step="0.0001" value={formData.lat} onChange={handleChange} />

        <label style={styles.label}>User Longitude</label>
        <input style={styles.input} name="long" type="number" step="0.0001" value={formData.long} onChange={handleChange} />

        <label style={styles.label}>Merchant Latitude</label>
        <input style={styles.input} name="merch_lat" type="number" step="0.0001" value={formData.merch_lat} onChange={handleChange} />

        <label style={styles.label}>Merchant Longitude</label>
        <input style={styles.input} name="merch_long" type="number" step="0.0001" value={formData.merch_long} onChange={handleChange} />

        <label style={styles.label}>Job*</label>
        <select style={styles.select} name="job" value={formData.job} onChange={handleChange}>
        <option value="">-- Select Job --</option>
        {jobs.map(job => (
          <option key={job} value={job}>
            {job.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </option>
        ))}
        </select>

        <label style={styles.label}>Transaction Date*</label>
        <input style={styles.input} name="trans_date" type="date" value={formData.trans_date} onChange={handleChange} />

        <label style={styles.label}>Transaction Time*</label>
        <input style={styles.input} name="trans_time" type="time" value={formData.trans_time} onChange={handleChange} />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check Fraud"}
        </button>
      </form>

      {result && (
        <div style={styles.result(result.prediction === 1,result.risk_level)}>
          <h3>
            Prediction:{" "}
            <span style={styles.resultText(result.prediction === 1)}>
              {result.prediction === 1? result.risk_level === "Medium"? 'LIKELY FRAUD': 'FRAUD': 'NOT FRAUD'}
            </span>
          </h3>
          <p>Risk Level: {result.risk_level}</p>
          <p>Probability: {result.probability.toFixed(4)}</p>

          {/* ⚠️ Medium Risk Warning */}
          {result.prediction === 1 && result.risk_level === "Medium" && (
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <p>⚠️ This transaction appears moderately suspicious.</p>
              <ul style={styles.ul}>
                <li>🔍 Double-check the transaction location and amount</li>
                <li>🔎 Confirm you recognize the merchant</li>
              </ul>
              <p>✅ If this transaction wasn’t made by you, contact your bank immediately.</p>
            </div>
          )}

          {/* 🚨 High Risk Warning */}
          {result.prediction === 1 && result.risk_level === "High" && (
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <p>🚨 High Risk of Fraud Detected!</p>
              <p>This transaction is likely fraudulent.</p>
              <p>🚫 Do NOT authorize or proceed with this payment.</p>
              <p>📞 Contact your bank or card issuer immediately.</p>

              {/* Enhancements */}
              <button
                onClick={() => alert("Fraud report sent!")}
                style={styles.buttonSecondary}
              >
                🚨 Report Fraud
              </button>

              <details style={{ marginTop: '1rem' }}>
                <summary style={styles.summary}>🔎 View Suspicious Details</summary>
                <p>- Transaction is far from your location.</p>
                <p>- Amount is unusually high.</p>
              </details>

              <div style={{ marginTop: '1rem' }}>
                <label>Confidence Score</label>
                <div style={styles.confidenceBar}>
                  <div
                    style={{
                      width: `${(result.probability * 100).toFixed(0)}%`,
                      background: 'red',
                      height: '10px'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
