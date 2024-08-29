import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fixing the default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0) return <div>No route information available.</div>;

  // Calculate center position
  const center = [itinerary[0].start.lat, itinerary[0].start.lng];

  // Extract polyline points
  const polylinePoints = itinerary.map(day => [
    [day.start.lat, day.start.lng],
    [day.stop.lat, day.stop.lng],
  ]).flat();

  return (
    <MapContainer center={center} zoom={10} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {itinerary.map((day, index) => (
        <Marker key={index} position={[day.start.lat, day.start.lng]}>
          <Popup>
            <strong>Stop {index + 1}</strong>: {day.start.name}
          </Popup>
        </Marker>
      ))}
      {/* Mark the final stop of the route */}
      {itinerary.length > 0 && (
        <Marker position={[itinerary[itinerary.length - 1].stop.lat, itinerary[itinerary.length - 1].stop.lng]}>
          <Popup>
            <strong>Stop {itinerary.length * 2}</strong>: {itinerary[itinerary.length - 1].stop.name}
          </Popup>
        </Marker>
      )}
      <Polyline positions={polylinePoints} color="red" />
    </MapContainer>
  );
};

export default MapView;
