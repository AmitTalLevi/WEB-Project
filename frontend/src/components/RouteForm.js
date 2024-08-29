import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CountrySelect from './CountrySelect';
import './RouteForm.css';
import { Oval } from 'react-loader-spinner'; // Import the spinner component

const RouteForm = ({ setTrip }) => {
  const [country, setCountry] = useState('');
  const [type, setType] = useState('car');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!country || !type) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true); // Set loading to true when the request starts

    try {
      const response = await axios.post('http://localhost:5005/api/trips', { country, type });
      if (response.status === 200) {
        setTrip({ ...response.data, country });
        navigate('/trip-details');
      }
    } catch (error) {
      console.error('Error creating trip', error);
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <div className="container">
      <h1 className="header">3 Daily route trips in the country around the world</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="label" htmlFor="country">Country:</label>
        <CountrySelect value={country} onChange={(e) => setCountry(e.target.value)} required />

        <label className="label" htmlFor="type">Trip Type:</label>
        <select className="select" id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="car">Car</option>
          <option value="bicycle">Bicycle</option>
        </select>

        <button type="submit" disabled={loading}>Create Trip</button>
      </form>
      {/* Show spinner while loading */}
      {loading && <Oval color="#007bff" height={80} width={80} />}
    </div>
  );
};

export default RouteForm;
