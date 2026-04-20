import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Tracker from './pages/Tracker';

function App() {
  const [unit, setUnit] = useState('kg');

  useEffect(() => {
    const savedUnit = localStorage.getItem('workout_unit');
    if (savedUnit) setUnit(savedUnit);
    else localStorage.setItem('workout_unit', 'kg');
  }, []);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('workout_unit', newUnit);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home unit={unit} onUnitChange={handleUnitChange} />} />
        <Route path="/tracker/:dayId" element={<Tracker unit={unit} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
