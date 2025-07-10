import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PredictFraud from './components/PredictFraud';
import VisualAnalytics from './components/VisualAnalytics';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<PredictFraud />} />
          <Route path="/analytics" element={<VisualAnalytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
