import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import "leaflet/dist/leaflet.css";

const VisualAnalytics = () => {
  const [fraudByCategory, setFraudByCategory] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);
  // const [featureImportance, setFeatureImportance] = useState([]);

  const COLORS = {low: "#00C49F", // Green
                  medium: "#FFBB28",  // Yellow
                  high: "#FF4444",  };

  useEffect(() => {
    fetch("http://localhost:5000/analytics")
      .then(res => res.json())
      .then(data => {
        setFraudByCategory(data.fraud_by_category || []);
        setRiskLevels(data.risk_levels || []);
        // setFeatureImportance(data.feature_importance || []);
      })
      .catch((err) => {
        console.error("Failed to fetch analytics, using sample data:", err);
      });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📊 Visual Analytics</h2>

      {/* 1. Fraud % by Category */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-2">Fraud Cases by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fraudByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Risk Level Pie Chart */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-2">Risk Level Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={riskLevels}
              dataKey="count"
              nameKey="level"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {riskLevels.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.level.toLowerCase()] || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisualAnalytics;
