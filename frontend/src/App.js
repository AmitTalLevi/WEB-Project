import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RouteForm from './components/RouteForm';
import TripDetails from './components/TripDetails';
import History from './components/History';

const App = () => {
  const [trip, setTrip] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RouteForm setTrip={setTrip} />} />
        <Route path="/trip-details" element={<TripDetails trip={trip} />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
};

export default App;
