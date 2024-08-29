import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/history');
        setTrips(response.data);
      } catch (err) {
        console.error('Error fetching trip history:', err);
        setError('Failed to load trip history.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <div>Loading trip history...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Trip History</h2>
      {trips.map((trip, index) => (
        <div key={index}>
          <h3>Trip ID: {trip.uuid}</h3>
          <p>Prompt: {trip.prompt}</p>
          <p>Country: {trip.country}</p>
          {trip.generatedImage && (
            <img src={trip.generatedImage} alt="Generated AI" style={{ maxWidth: '100%', height: 'auto' }} />
          )}
          <div>
            {trip.response.map((day, index) => (
              <div key={index}>
                <h4>Day {day.day}</h4>
                <p><strong>Start:</strong> {`${day.start.name} (Lat: ${day.start.lat}, Lng: ${day.start.lng})`}</p>
                <p><strong>Stop:</strong> {`${day.stop.name} (Lat: ${day.stop.lat}, Lng: ${day.stop.lng})`}</p>
                <p><strong>Description:</strong> {day.description}</p>
                <p><strong>Distance:</strong> {day.distance} km</p>
                <p><strong>Duration:</strong> {day.duration} hours</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
