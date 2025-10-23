import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = () => {
  const [connections, setConnections] = useState([]);
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/connections', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setConnections(data));

    fetch('http://localhost:8000/api/threats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setThreats(data));
  }, []);

  const mapStyles = {
    height: '100vh',
    width: '100%',
  };

  const defaultCenter = {
    lat: 0,
    lng: 0,
  };

  return (
    // IMPORTANT: You need to replace 'YOUR_GOOGLE_MAPS_API_KEY' with a valid Google Maps API key for this feature to work.
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={mapStyles} zoom={2} center={defaultCenter}>
        {connections.map((connection, index) => (
          <Marker
            key={`connection-${index}`}
            position={{ lat: parseFloat(connection.location.split(',')[0]), lng: parseFloat(connection.location.split(',')[1]) }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
          />
        ))}
        {threats.map((threat, index) => (
          <Marker
            key={`threat-${index}`}
            position={{ lat: parseFloat(threat.location.split(',')[0]), lng: parseFloat(threat.location.split(',')[1]) }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
