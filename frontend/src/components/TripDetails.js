import React, { useEffect, useState } from 'react';
import MapView from './MapView';
import axios from 'axios';
import { Oval } from 'react-loader-spinner'; 
import './TripDetails.css'; 

const TripDetails = ({ trip }) => {
  const [imageUrl, setImageUrl] = useState(trip.imageUrl || null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    if (!imageUrl && trip.country && trip.uuid) {
      const fetchImageUrl = async () => {
        try {
          console.log("client generating image to uuid - " + trip.uuid);
          const response = await axios.post('http://localhost:5005/api/generate-image', { uuid: trip.uuid, country: trip.country });
          if (response.data.imageUrl) {
            setImageUrl(response.data.imageUrl);
          } else {
            throw new Error('Image URL not available');
          }
        } catch (err) {
          console.error('Error fetching image URL:', err);
          setImageError('Failed to load image.');
        } finally {
          setImageLoading(false);
        }
      };

      fetchImageUrl();
    } else {
      setImageLoading(false);
    }
  }, [trip, imageUrl]);

  const { prompt, response } = trip;

  if (!Array.isArray(response)) {
    return <div>Invalid trip details format</div>;
  }

  return (
    <div className="trip-details-container">
      <h2 className="trip-details-header">Trip Details</h2>
      <p className="trip-details-prompt"><strong>Prompt:</strong> {prompt}</p>
      <div className="map-container">
        <MapView itinerary={response} />
      </div>
      <div className="trip-details">
        {response.map((day, index) => (
          <div key={index} className="day-detail">
            <h3>Day {day.day}</h3>
            <p><strong>Start:</strong> {`${day.start.name} (Lat: ${day.start.lat}, Lng: ${day.start.lng})`}</p>
            <p><strong>Stop:</strong> {`${day.stop.name} (Lat: ${day.stop.lat}, Lng: ${day.stop.lng})`}</p>
            <p><strong>Description:</strong> {day.description}</p>
            <p><strong>Distance:</strong> {day.distance} km</p>
            <p><strong>Duration:</strong> {day.duration} hours</p>
          </div>
        ))}
      </div>
      <div className="image-container">
        {imageLoading ? (
          <Oval
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass="spinner"
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        ) : imageError ? (
          <div className="image-error">{imageError}</div>
        ) : (
          <img src={imageUrl} alt="Generated AI" className="generated-image" />
        )}
      </div>
    </div>
  );
};

export default TripDetails;
